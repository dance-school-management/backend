import { Request, Response } from "express";
import { Class, ClassTemplate } from "../../../generated/client";
import prisma from "../../utils/prisma";
import { ClassType } from "../../../generated/client";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../../errors/UniversalError";
import { getClassesInstructors } from "../../grpc/client/enrollCommunication/getClassesInstructors";
import { ClassStatus } from "../../../generated/client";
import { EnrollStudentsAndInstructorInPrivateClassMsgData } from "../../rabbitmq/types";
import { EnrollStudentsAndInstructorInPrivateClass } from "../../rabbitmq/senders/enrollStudentsAndInstructorInPrivateClass";
import { getClassesStudents } from "../../grpc/client/enrollCommunication/getClassesStudents";
import { hasIntersection, intersectSets } from "../../utils/helpers";
import { getStudentsProfiles } from "../../grpc/client/profileCommunication/getStudentsProfiles";

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
      currency: classTemplateData.currency,
      scheduleTileColor: classTemplateData.scheduleTileColor,
    },
  });

  res.status(StatusCodes.OK).json({
    message: "Class template for private class created",
    classTemplateData: createdClassTemplate,
  });
}

export async function createPrivateClass(
  req: Request<{}, {}, { classData: Class; studentIds: string[] }> & {
    user?: any;
  },
  res: Response,
) {
  const { classData } = req.body;

  const studentIds = [...new Set(req.body.studentIds)];

  const theClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      id: classData.classTemplateId,
    },
  });

  if (theClassTemplate?.classType !== "PRIVATE_CLASS") {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Chosen class template must be of type private class",
      [],
    );
  }

  const overlappingClasses = await prisma.class.findMany({
    where: {
      startDate: {
        lte: classData.startDate,
      },
      endDate: {
        gte: classData.endDate,
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

  if (occupiedInstructors.includes(req.user?.instructorId)) {
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

  const newClass = await prisma.class.create({
    data: {
      classRoomId: classData.classRoomId,
      classStatus: ClassStatus.NORMAL,
      classTemplateId: classData.classTemplateId,
      startDate: classData.startDate,
      endDate: classData.endDate,
      groupNumber: classData.groupNumber,
      peopleLimit: classData.peopleLimit,
    },
  });

  const msg: EnrollStudentsAndInstructorInPrivateClassMsgData = {
    classId: newClass.id,
    instructorIds: [req.user?.id],
    studentIds,
  };

  await EnrollStudentsAndInstructorInPrivateClass(msg);

  res.status(StatusCodes.OK).json(newClass);
}
