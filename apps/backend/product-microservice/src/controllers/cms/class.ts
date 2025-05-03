import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";
import { StatusCodes } from "http-status-codes";
import { Prisma, Class, ClassStatus } from "../../../generated/client";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { Warning } from "../../errors/Warning";

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

  const thisClassTemplate = await prisma.classTemplate.findUniqueOrThrow({
    where: {
      id: classTemplateId,
    },
  });

  const thisClassroom = await prisma.classRoom.findUniqueOrThrow({
    where: {
      id: classRoomId,
    },
  });

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
    throw new Error(
      "Classroom occupied: this classroom is occupied during the specified time span",
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
    throw new Error(
      "Overlapping classes: can't proceed, because this group would have overlapping classes",
    );
  }

  const instructorOccupation = await prisma.class.findMany({
    where: {
      startDate: {
        lte: endDate,
      },
      endDate: {
        gte: startDate,
      },
      instructor: {
        some: {
          instructorId: {
            in: instructorIds,
          },
        },
      },
    },
  });
  if (instructorOccupation.length > 0) {
    throw new Error(
      "One of the instructors is occupied in the specified time span",
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
  const createdClass = await prisma.class.create({
    data: {
      classTemplateId,
      groupNumber,
      startDate,
      endDate,
      peopleLimit,
      classRoomId,
      instructor: {
        create: instructorIds.map((instructorId: number) => ({
          instructorId,
        })),
      },
      classStatus,
    },
  });

  res.status(StatusCodes.CREATED).json(createdClass);
}

export async function getSchedule(
  req: Request<{ startDateFrom: Date; startDateTo: Date }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
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
      student: true,
    },
  });

  const result = {
    schedule: allClassesBetweenDates.map((cur) => ({
      startDate: cur.startDate,
      endDate: cur.endDate,
      name: cur.classTemplate.name,
      groupNumber: cur.groupNumber,
      vacancies: cur.peopleLimit - cur.student.length,
      danceCategoryName: cur.classTemplate.danceCategory?.name,
      advancementLevelName: cur.classTemplate.advancementLevel?.name,
      courseName: cur.classTemplate.course?.name,
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
  const { classId, newStatus, isConfirmation } = req.body;

  const currentClass = await prisma.class.findUniqueOrThrow({
    where: {
      id: classId,
    },
  });

  if (!currentClass) {
    throw new Error("There is no class with this id");
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
