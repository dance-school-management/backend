import { Request, Response } from "express";
import { Class, ClassTemplate } from "../../../generated/client";
import prisma from "../../utils/prisma";
import { ClassType } from "../../../generated/client";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../../errors/UniversalError";
import { getClassesInstructors } from "../../grpc/client/enrollCommunication/getClassesInstructors";
import { ClassStatus } from "../../../generated/client";
import {
  EnrollStudentsAndInstructorInPrivateClassMsgData,
  NotificationMsgData,
} from "../../rabbitmq/types";
import { EnrollStudentsAndInstructorInPrivateClass } from "../../rabbitmq/senders/enrollStudentsAndInstructorInPrivateClass";
import { getClassesStudents } from "../../grpc/client/enrollCommunication/getClassesStudents";
import { hasIntersection, intersectSets } from "../../utils/helpers";
import { getStudentsProfiles } from "../../grpc/client/profileCommunication/getStudentsProfiles";
import { sendPushNotifications } from "../../rabbitmq/senders/sendPushNotifications";

export async function createPrivateClassTemplate(
  req: Request<{}, {}, { classTemplateData: ClassTemplate }> & {
    user?: any;
  },
  res: Response,
) {
  const { classTemplateData } = req.body;

  const createdClassTemplate = await prisma.classTemplate.create({
    data: {
      name: classTemplateData.name,
      description: classTemplateData.description,
      danceCategoryId: classTemplateData.danceCategoryId,
      advancementLevelId: classTemplateData.advancementLevelId,
      classType: ClassType.PRIVATE_CLASS,
      price: classTemplateData.price,
      createdBy: req.user?.id,
    },
  });

  res.status(StatusCodes.OK).json({
    message: "Class template for private class created",
    classTemplateData: createdClassTemplate,
  });
}

export async function editPrivateClassTemplate(
  req: Request<{}, {}, { classTemplateData: ClassTemplate }> & {
    user?: any;
  },
  res: Response,
) {
  const { classTemplateData } = req.body;

  const instructorId = req.user?.id;

  const theClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      id: classTemplateData.id,
    },
  });

  if (!theClassTemplate) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template not found",
      [],
    );
  }

  if (theClassTemplate.classType !== ClassType.PRIVATE_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You cannot edit a non-private class",
      [],
    );
  }

  if (theClassTemplate.createdBy !== instructorId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This class template was not created by you",
      [],
    );
  }

  const editedClassTemplate = await prisma.classTemplate.update({
    where: {
      id: classTemplateData.id,
    },
    data: {
      name: classTemplateData.name,
      description: classTemplateData.description,
      danceCategoryId: classTemplateData.danceCategoryId,
      advancementLevelId: classTemplateData.advancementLevelId,
      classType: ClassType.PRIVATE_CLASS,
      price: classTemplateData.price,
    },
  });

  res.status(StatusCodes.OK).json({
    message: "Class template for private class edited",
    classTemplateData: editedClassTemplate,
  });
}

export async function getPrivateClassTemplates(
  req: Request<{}, {}, {}> & {
    user?: any;
  },
  res: Response,
) {
  const instructorId = req.user?.id;

  const hisClassTemplates = await prisma.classTemplate.findMany({
    where: {
      createdBy: instructorId,
      classType: ClassType.PRIVATE_CLASS,
    },
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
  });

  res.status(StatusCodes.OK).json(hisClassTemplates);
}

export async function getPrivateClassTemplateDetails(
  req: Request<{ id: string }> & {
    user?: any;
  },
  res: Response,
) {
  const id = Number(req.params.id);

  const instructorId = req.user?.id;

  const theClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      createdBy: instructorId,
      classType: ClassType.PRIVATE_CLASS,
      id,
    },
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
  });

  if (!theClassTemplate) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      `Class template with id ${id}, created by ${instructorId}, with class type PRIVATE_CLASS not found`,
      [],
    );
  }

  res.status(StatusCodes.OK).json(theClassTemplate);
}

async function validatePrivateClass(
  classData: Class,
  studentIds: string[],
  instructorId: string,
) {
  const theClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      id: classData.classTemplateId,
    },
  });

  if (!theClassTemplate) {
    throw new UniversalError(StatusCodes.CONFLICT, "Class template not found", [
      { field: "classTemplateId", message: "Class template not found" },
    ]);
  }

  if (theClassTemplate.classType !== "PRIVATE_CLASS") {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Chosen class template must be of type private class",
      [],
    );
  }

  if (theClassTemplate.createdBy !== instructorId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The given class template was not created by you",
      [{ field: "req.user.id", message: "It is not your class template" }],
    );
  }

  const overlappingClasses = await prisma.class.findMany({
    where: {
      startDate: {
        lte: classData.endDate,
      },
      endDate: {
        gte: classData.startDate,
      },
    },
  });

  if (
    overlappingClasses?.some((oc) => oc.classRoomId === classData.classRoomId)
  ) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The given classroom is occupied in the specified timespan",
      [],
    );
  }

  const occupiedInstructors = (
    await getClassesInstructors(overlappingClasses.map((oc) => oc.id))
  ).instructorsClassesIdsList.map((ic) => ic.instructorId);

  if (occupiedInstructors.includes(instructorId)) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The given instructor is occupied in the specified timespan",
      [],
    );
  }

  const occupiedStudentsSet = new Set(
    (
      await getClassesStudents(overlappingClasses.map((oc) => oc.id))
    ).studentsClassesIdsList.map((sci) => sci.studentId),
  );

  const studentIdsSet = new Set(studentIds);

  if (hasIntersection<string>(occupiedStudentsSet, studentIdsSet)) {
    const occupiedStudentsList = (
      await getStudentsProfiles([
        ...intersectSets<string>(occupiedStudentsSet, studentIdsSet),
      ])
    ).studentProfilesList;

    throw new UniversalError(
      StatusCodes.CONFLICT,
      `Students ${occupiedStudentsList.map((ost) => ost.firstName + " " + ost.lastName).join(", ")} have overlapping classes`,
      [],
    );
  }

  return { theClassTemplate };
}

export async function createPrivateClass(
  req: Request<{}, {}, { classData: Class; studentIds: string[] }> & {
    user?: any;
  },
  res: Response,
) {
  const { classData } = req.body;

  const studentIds = [...new Set(req.body.studentIds)];

  const instructorId = req.user?.id;

  const { theClassTemplate } = await validatePrivateClass(
    classData,
    studentIds,
    instructorId,
  );

  const newClass = await prisma.class.create({
    data: {
      classRoomId: classData.classRoomId,
      classStatus: ClassStatus.NORMAL,
      classTemplateId: classData.classTemplateId,
      startDate: classData.startDate,
      endDate: classData.endDate,
      groupNumber: classData.groupNumber,
      peopleLimit: classData.peopleLimit,
      createdBy: instructorId,
    },
  });

  const msg: EnrollStudentsAndInstructorInPrivateClassMsgData = {
    classId: newClass.id,
    instructorIds: [req.user?.id],
    studentIds,
  };

  await EnrollStudentsAndInstructorInPrivateClass(msg);

  const message: NotificationMsgData = {
    userIds: studentIds,
    title: `Invitation for class - ${theClassTemplate.name}`,
    body: `You have been invited for a private class ${theClassTemplate.name}, which starts at ${newClass.startDate.toDateString()}. You can accept the invitation by paying for the class in the app.`,
    payload: {
      event: "CLASS_INVITATION",
      classId: newClass.id,
    },
  };

  await sendPushNotifications(message);

  const studentsData = (await getStudentsProfiles(studentIds))
    .studentProfilesList;

  res.status(StatusCodes.OK).json({
    class: newClass,
    students: studentsData,
  });
}

export async function editPrivateClass(
  req: Request<{}, {}, { classData: Class }> & {
    user?: any;
  },
  res: Response,
) {
  const { classData } = req.body;

  const studentIds = (
    await getClassesStudents([classData.id])
  ).studentsClassesIdsList.map((cs) => cs.studentId);

  const instructorId = req.user?.id;

  const theClass = await prisma.class.findFirst({
    where: {
      id: classData.id,
    },
    include: { classTemplate: true },
  });

  if (!theClass) {
    throw new UniversalError(StatusCodes.CONFLICT, "Class not found", []);
  }

  if (theClass.createdBy !== instructorId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This class was not created by you",
      [{ field: "req.user.id", message: "It is not your class" }],
    );
  }

  const { theClassTemplate } = await validatePrivateClass(
    classData,
    studentIds,
    instructorId,
  );

  const updatedClass = await prisma.class.update({
    where: {
      id: classData.id,
    },
    data: {
      classRoomId: classData.classRoomId,
      classTemplateId: classData.classTemplateId,
      startDate: classData.startDate,
      endDate: classData.endDate,
      groupNumber: classData.groupNumber,
    },
  });

  const message: NotificationMsgData = {
    userIds: studentIds,
    title: `Invitation for class changed - ${theClassTemplate.name}`,
    body: `Your invitation for a private class ${theClass.classTemplate.name} has changed. You can view changes in the ticket page.`,
    payload: {
      event: "CLASS_INVITATION_CHANGED",
      classId: updatedClass.id,
    },
  };

  await sendPushNotifications(message);

  res.status(StatusCodes.OK).json(updatedClass);
}

export async function getPrivateClasses(
  req: Request & {
    user?: any;
  },
  res: Response,
) {
  const instructorId = req.user?.id;

  const hisClasses = await prisma.class.findMany({
    where: {
      createdBy: instructorId,
      classTemplate: {
        classType: ClassType.PRIVATE_CLASS,
      },
    },
    include: {
      classTemplate: {
        include: {
          danceCategory: true,
          advancementLevel: true,
        },
      },
      classRoom: true,
    },
  });

  res.status(StatusCodes.OK).json(hisClasses);
}

export async function getPrivateClassDetails(
  req: Request<{ id: string }> & {
    user?: any;
  },
  res: Response,
) {
  const id = Number(req.params.id);

  const instructorId = req.user?.id;

  const theClass = await prisma.class.findFirst({
    where: {
      createdBy: instructorId,
      classTemplate: {
        classType: ClassType.PRIVATE_CLASS,
      },
      id,
    },
    include: {
      classTemplate: {
        include: {
          danceCategory: true,
          advancementLevel: true,
        },
      },
      classRoom: true,
    },
  });

  if (!theClass) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      `Class with id ${id}, created by ${instructorId}, with class type PRIVATE_CLASS not found`,
      [],
    );
  }

  res.status(StatusCodes.OK).json(theClass);
}
