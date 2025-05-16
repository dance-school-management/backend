import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { Class, ClassStatus } from "../../../generated/client";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { Warning } from "../../errors/Warning";
import {
  enrollInstructorsInClass,
  getClassesInstructors,
  getClassesStudents,
  getInstructorsClasses,
} from "../../grpc/client/cms/class";
import { UniversalError } from "../../errors/UniversalError";

export async function createClass(
  req: Request<
    {},
    {},
    Class & { instructorIds: number[]; isConfirmation: boolean }
  >,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const {
    instructorIds,
    classRoomId,
    groupNumber,
    startDate,
    endDate,
    peopleLimit,
    classTemplateId,
    isConfirmation,
    classStatus,
  } = req.body;

  if (startDate >= endDate) {
    throw new Error("End date must be greater than start date");
  }

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
    return;
  }

  const thisClassroom = await prisma.classRoom.findFirst({
    where: {
      id: classRoomId,
    },
  });

  if (!thisClassroom) {
    throw new UniversalError(StatusCodes.NOT_FOUND, "Classroom not found", []);
    return;
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
    },
  });

  if (classRoomOccupation) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Classroom occupied: this classroom is occupied during the specified time span",
      [],
    );
  }

  const thisGroupThisCourseClasses = await prisma.class.findMany({
    where: {
      classTemplate: {
        courseId: {
          equals: thisClassTemplate.courseId,
        },
      },
      groupNumber,
    },
  });

  const overlappingClasses = thisGroupThisCourseClasses.filter(
    (thisGroupThisCourseClass) =>
      thisGroupThisCourseClass.startDate <= endDate &&
      thisGroupThisCourseClass.endDate >= startDate,
  );

  if (overlappingClasses.length > 0) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Overlapping classes: can't proceed, because this group would have overlapping classes",
      [],
    );
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
        in: allClassIdsConductedByGivenInstructors.instructorsClassesIdsList.map(
          (item) => item.classId,
        ),
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

  let createdClass;

  try {
    createdClass = await prisma.class.create({
      data: {
        classTemplateId,
        groupNumber,
        startDate,
        endDate,
        peopleLimit,
        classRoomId,
        classStatus,
      },
    });

    await enrollInstructorsInClass(createdClass.id, instructorIds);
  } catch (err: any) {
    if (createdClass) {
      deleteClass(createdClass.id);
    }
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create class",
      [],
    );
  }

  res.status(StatusCodes.CREATED).json(createdClass);
}

async function deleteClass(id: number) {
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

export async function getSchedule(
  req: Request<{ startDateFrom: Date; startDateTo: Date }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { startDateFrom, startDateTo } = req.params;
  const allClassesBetweenDates = await prisma.class.findMany({
    where: {
      startDate: {
        gte: startDateFrom,
        lte: startDateTo,
      },
    },
    include: {
      classTemplate: {
        include: {
          course: true,
          danceCategory: true,
          advancementLevel: true,
        },
      },
      // student: true,
    },
  });

  const classesInstructors = await getClassesInstructors(
    allClassesBetweenDates.map((aClass) => aClass.id),
  );

  console.log(classesInstructors);
  // TODO - pobrać z profile microservice imiona i nazwiska instruktorów i wyświetlić

  const classesStudents = await getClassesStudents(
    allClassesBetweenDates.map((aClass) => aClass.id),
  );

  const result = {
    schedule: allClassesBetweenDates.map((cur) => ({
      startDate: cur.startDate,
      endDate: cur.endDate,
      name: cur.classTemplate.name,
      groupNumber: cur.groupNumber,
      vacancies:
        cur.peopleLimit -
        classesStudents.studentsClassesIdsList.reduce(
          (acc, item) => (item.classId === cur.id ? acc + 1 : acc),
          0,
        ),
      danceCategoryName: cur.classTemplate.danceCategory
        ? cur.classTemplate.danceCategory.name
        : null,
      advancementLevelName: cur.classTemplate.advancementLevel
        ? cur.classTemplate.advancementLevel.name
        : null,
      courseName: cur.classTemplate.course
        ? cur.classTemplate.course.name
        : null,
      classStatus: cur.classStatus,
    })),
  };
  res.status(StatusCodes.OK).json(result);
}

export async function editClassStatus(
  req: Request<
    {},
    {},
    { classId: number; newStatus: ClassStatus; isConfirmation: boolean }
  >,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { classId, newStatus, isConfirmation } = req.body;
  const currentClass = await prisma.class.findFirst({
    where: {
      id: classId,
    },
  });
  if (!currentClass) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "There is no class with this id",
      [],
    );
  }
  if (!isConfirmation) {
    throw new Warning(
      `This class' status is ${currentClass.classStatus} and you are trying to set it to ${newStatus}`,
      StatusCodes.CONFLICT,
    );
  }
  const result = await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      classStatus: newStatus,
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

  const classInstructors = await getClassesInstructors([id]);

  // TODO - zwrócić jeszcze dane instruktorów

  const classStudents = await getClassesStudents([id]);

  const result = {
    class: theClass,
    vacancies:
      theClass.peopleLimit - classStudents.studentsClassesIdsList.length,
  };

  res.status(StatusCodes.OK).json(result);
}
