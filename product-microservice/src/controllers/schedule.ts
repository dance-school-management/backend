import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import {
  getInstructorsClasses,
  getStudentClasses,
} from "../grpc/client/enrollCommunication/class";
import { UniversalError } from "../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import { ClassStatus } from "../../generated/client";

interface GetScheduleParams {
  dateFrom: string;
  dateTo: string;
}

export async function getSchedule(
  req: Request<object, object, object, GetScheduleParams> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const { dateFrom, dateTo } = req.query;

  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);

  const where: any = {
    startDate: { gte: startDate, lte: endDate },
    classStatus: { notIn: [ClassStatus.HIDDEN] },
  };
  try {
    const classesData = await prisma.class.findMany({
      where,
      include: {
        classTemplate: {
          include: {
            danceCategory: true,
            advancementLevel: true,
            course: true,
          },
        },
      },
    });
    res.status(StatusCodes.OK).json(classesData);
  } catch (err: any) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem with getting classes",
      [],
    );
  }
}

export async function getSchedulePersonal(
  req: Request<object, object, object, GetScheduleParams> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const { dateFrom, dateTo } = req.query;

  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  let userId;
  let role;
  if (req.user) {
    userId = req.user.id;
    role = req.user.role;
  } else {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem with providing user data to product microservice",
      [],
    );
  }
  let classes: number[] = [];
  if (role == "STUDENT") {
    const response = await getStudentClasses(userId);
    classes = response.studentClassesList.map((entry) => entry.classId);
  } else if (role == "INSTRUCTOR") {
    const response = await getInstructorsClasses([userId]);
    classes = response.instructorsClassesIdsList.map((entry) => entry.classId);
  } else {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      `User with role ${role || "unknown"} doesn't have a personal schedule`,
      [],
    );
  }
  const where: any = {
    startDate: { gte: startDate, lte: endDate },
    classStatus: { notIn: [ClassStatus.HIDDEN] },
    ...(classes.length > 0 ? { id: { in: classes } } : {}),
  };
  try {
    const classesData = await prisma.class.findMany({
      where,
      include: {
        classTemplate: {
          include: {
            danceCategory: true,
            advancementLevel: true,
            course: true,
          },
        },
      },
    });
    res.status(StatusCodes.OK).json(classesData);
  } catch (err: any) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem with getting classes",
      [],
    );
  }
}
