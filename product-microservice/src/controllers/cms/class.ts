import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { Class, ClassStatus } from "../../../generated/client";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { Warning } from "../../errors/Warning";
import { enrollInstructorsInClass } from "../../grpc/client/enrollCommunication/enrollInstructorsInClass";
import { UniversalError } from "../../errors/UniversalError";
import { getOtherInstructorsData } from "../../grpc/client/profileCommunication/getOtherInstructorsData";
import { getInstructorsClasses } from "../../grpc/client/enrollCommunication/getInstructorsClasses";
import { getClassesInstructors } from "../../grpc/client/enrollCommunication/getClassesInstructors";
import { getClassesStudents } from "../../grpc/client/enrollCommunication/getClassesStudents";
import { getInstructorsData } from "../../grpc/client/profileCommunication/getInstructorsData";
import { ClassType } from "../../../generated/client";
import { CourseStatus } from "../../../generated/client";

async function validateClass(
  startDate: Date,
  endDate: Date,
  classRoomId: number,
  classTemplateId: number,
  instructorIds: string[],
  peopleLimit: number,
  isConfirmation: boolean,
  id?: number,
) {
  if (startDate >= endDate) {
    throw new Error("End date must be greater than start date");
  }

  const thisClassroom = await prisma.classRoom.findFirst({
    where: {
      id: classRoomId,
    },
  });

  if (!thisClassroom) {
    throw new UniversalError(StatusCodes.NOT_FOUND, "Classroom not found", []);
  }

  const classRoomOccupation = await prisma.class.findFirst({
    where: {
      classRoomId,
      startDate: {
        lte: endDate,
      },
      endDate: {
        gte: startDate,
      },
      ...(id && { id: { not: id } }),
    },
  });

  if (classRoomOccupation) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Classroom occupied: this classroom is occupied during the specified time span",
      [],
    );
  }

  const providedClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      id: classTemplateId,
    },
  });

  if (!providedClassTemplate) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Provided class template not found",
      [],
    );
  }

  if (providedClassTemplate.courseId) {
    const thisCourseClasses = await prisma.class.findMany({
      where: {
        classTemplate: {
          courseId: providedClassTemplate.courseId,
        },
        ...(id && { id: { not: id } }),
      },
    });

    const overlappingClasses = thisCourseClasses.filter(
      (thisCourseClass) =>
        thisCourseClass.startDate <= endDate &&
        thisCourseClass.endDate >= startDate,
    );

    if (overlappingClasses.length > 0) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "Overlapping classes: can't proceed, because the course would have overlapping classes",
        [],
      );
    }
  }

  const allClassIdsConductedByGivenInstructors =
    await getInstructorsClasses(instructorIds);

  const instructorOccupation = await prisma.class.findMany({
    where: {
      startDate: {
        lte: endDate,
      },
      endDate: {
        gte: startDate,
      },
      id: {
        in: allClassIdsConductedByGivenInstructors.instructorsClassesIdsList
          .map((item) => item.classId)
          .filter((classId) => classId !== id),
      },
    },
  });

  if (instructorOccupation.length > 0) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "One of the instructors is occupied in the specified time span",
      [],
    );
  }

  if (peopleLimit > thisClassroom.peopleLimit) {
    if (!isConfirmation) {
      throw new Warning(
        "You are trying to exceed the classroom's people limit with the class people limit",
        StatusCodes.CONFLICT,
      );
    }
  }
}

export async function createClass(
  req: Request<
    {},
    {},
    Class & { instructorIds: string[]; isConfirmation: boolean }
  >,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const {
    instructorIds,
    classRoomId,
    startDate,
    endDate,
    peopleLimit,
    classTemplateId,
    isConfirmation,
  } = req.body;

  const thisClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      id: classTemplateId,
    },
  });

  if (!thisClassTemplate) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Class template not found",
      [],
    );
  }

  if (thisClassTemplate.courseId) {
    const theCourse = await prisma.course.findFirst({
      where: {
        id: thisClassTemplate.courseId,
      },
    });

    if (!theCourse) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "The given class template has a course assigned, but the course not found",
        [],
      );
    }

    if (theCourse.courseStatus !== CourseStatus.HIDDEN) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "You can't add a class to a published course",
        [],
      );
    }
  }

  await validateClass(
    startDate,
    endDate,
    classRoomId,
    classTemplateId,
    instructorIds,
    peopleLimit,
    isConfirmation,
  );

  let createdClass;

  try {
    createdClass = await prisma.class.create({
      data: {
        classTemplateId,
        startDate,
        endDate,
        peopleLimit,
        classRoomId,
        classStatus: ClassStatus.HIDDEN,
      },
    });

    await enrollInstructorsInClass(createdClass.id, instructorIds);
  } catch (err: any) {
    if (createdClass) {
      deleteClassCompensationFunction(createdClass.id);
    }
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create class",
      [],
    );
  }

  res.status(StatusCodes.CREATED).json(createdClass);
}

export async function editClass(
  req: Request<
    {},
    {},
    {
      id: number;
      classRoomId?: number;
      startDate?: Date;
      endDate?: Date;
      peopleLimit?: number;
      instructorIds?: string[];
      isConfirmation: boolean;
    }
  >,
  res: Response,
) {
  let {
    id,
    instructorIds,
    classRoomId,
    startDate,
    endDate,
    peopleLimit,
    isConfirmation,
  } = req.body;

  const theClass = await prisma.class.findFirst({
    where: {
      id,
    },
  });

  if (!theClass) {
    throw new UniversalError(StatusCodes.CONFLICT, "Class not found", []);
  }

  if (!classRoomId) classRoomId = theClass.classRoomId;
  if (!startDate) startDate = theClass.startDate;
  if (!endDate) endDate = theClass.endDate;
  if (!peopleLimit) peopleLimit = theClass.peopleLimit;
  if (!instructorIds)
    instructorIds = (
      await getClassesInstructors([id])
    ).instructorsClassesIdsList.map((ic) => ic.instructorId);

  if (theClass.classStatus === ClassStatus.HIDDEN) {
    await validateClass(
      startDate,
      endDate,
      classRoomId,
      theClass.classTemplateId,
      instructorIds,
      peopleLimit,
      isConfirmation,
      id,
    );

    let updatedClass;

    await prisma.$transaction(async (tx) => {
      updatedClass = await tx.class.update({
        where: {
          id,
        },
        data: {
          startDate,
          endDate,
          classRoomId,
          peopleLimit,
        },
      });

      await enrollInstructorsInClass(id, instructorIds);
    });

    res.status(StatusCodes.OK).json(updatedClass);
  } else {
    if (startDate) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "The class is published, startDate cannot be changed",
        [{ field: "startDate", message: "Should not be provided" }],
      );
    }

    if (endDate) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "The class is published, endDate cannot be changed",
        [{ field: "endDate", message: "Should not be provided" }],
      );
    }

    if (peopleLimit < theClass.peopleLimit) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "You can't decrease people limit of a published class",
        [],
      );
    }

    const theClassroom = await prisma.classRoom.findFirst({
      where: {
        id: classRoomId,
      },
    });

    if (!theClassroom) {
      throw new UniversalError(StatusCodes.CONFLICT, "Classroom not found", []);
    }

    if (theClassroom.peopleLimit < peopleLimit && !isConfirmation) {
      throw new Warning(
        "You are trying to exceed the classroom's people limit with the class people limit",
        StatusCodes.CONFLICT,
      );
    }

    const updatedClass = await prisma.class.update({
      where: {
        id,
      },
      data: {
        peopleLimit,
        classRoomId,
      },
    });

    res.status(StatusCodes.OK).json(updatedClass);
  }
}

async function deleteClassCompensationFunction(id: number) {
  try {
    await prisma.class.delete({
      where: {
        id,
      },
    });
  } catch (err: any) {
    console.log("Failed to compensate class creation by deleting class");
  }
}

export async function deleteClass(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);

  const theClass = await prisma.class.findFirst({
    where: {
      id,
    },
  });

  if (!theClass) {
    throw new UniversalError(StatusCodes.CONFLICT, "Class not found", []);
  }

  if (theClass.classStatus !== ClassStatus.HIDDEN) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You can't delete a published class",
      [],
    );
  }

  await prisma.class.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

export async function publishClass(
  req: Request<{}, {}, { classId: number }>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { classId } = req.body;

  const theClass = await prisma.class.findFirst({
    where: {
      id: classId,
    },
    include: {
      classTemplate: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!theClass) {
    throw new UniversalError(StatusCodes.CONFLICT, "Class not found", []);
  }

  if (theClass.classStatus !== ClassStatus.HIDDEN) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class has already been published",
      [],
    );
  }

  if (theClass.classTemplate.courseId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This class is part of course, you need to publish the entire course",
      [],
    );
  }

  const result = await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      classStatus: ClassStatus.NORMAL,
    },
  });
  res.status(StatusCodes.OK).json(result);
}

export async function getClassDetails(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const id = parseInt(req.params.id);

  const theClass = await prisma.class.findFirst({
    where: {
      id,
    },
    include: {
      classTemplate: {
        include: {
          course: true,
          danceCategory: true,
          advancementLevel: true,
        },
      },
      classRoom: true,
    },
  });

  if (!theClass)
    throw new UniversalError(StatusCodes.NOT_FOUND, "Class not found", []);

  if (theClass.classTemplate.classType === ClassType.PRIVATE_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This class has class template with class type PRIVATE CLASS",
      [],
    );
  }

  const classInstructors = (await getClassesInstructors([id]))
    .instructorsClassesIdsList;

  const classInstructorsIds = classInstructors.map((ci) => ci.instructorId);

  const instructorsData = (await getInstructorsData(classInstructorsIds))
    .instructorsDataList;

  const classStudents = await getClassesStudents([id]);

  const result = {
    class: theClass,
    vacancies:
      theClass.peopleLimit - classStudents.studentsClassesIdsList.length,
    instructors: instructorsData,
  };

  res.status(StatusCodes.OK).json(result);
}

export async function availableClassrooms(
  req: Request<{}, {}, {}, { startDateQ: string; endDateQ: string }>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { startDateQ, endDateQ } = req.query;

  const startDate = new Date(startDateQ);
  const endDate = new Date(endDateQ);

  const busyClassrooms = await prisma.class.findMany({
    where: {
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
    select: {
      classRoomId: true,
    },
    distinct: ["classRoomId"],
  });

  const busyClassroomIds = busyClassrooms.map((c) => c.classRoomId);

  const freeClassrooms = await prisma.classRoom.findMany({
    where: {
      id: {
        notIn: busyClassroomIds,
      },
    },
  });

  res.status(StatusCodes.OK).json({ freeClassrooms });
}

export async function availableInstructors(
  req: Request<{}, {}, {}, { startDateQ: string; endDateQ: string }>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { startDateQ, endDateQ } = req.query;

  const startDate = new Date(startDateQ);
  const endDate = new Date(endDateQ);

  const classIdsOfClassesBetweenDates = await prisma.class.findMany({
    where: {
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
    select: {
      id: true,
    },
  });

  const classesInstructors = await getClassesInstructors(
    classIdsOfClassesBetweenDates.map((item) => item.id),
  );

  const busyInstructorIds = classesInstructors.instructorsClassesIdsList.map(
    (item) => item.instructorId,
  );

  const freeInstructors = await getOtherInstructorsData(busyInstructorIds);

  res
    .status(StatusCodes.OK)
    .json({ freeInstructors: freeInstructors.instructorsDataList });
}
