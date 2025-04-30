import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";
import { StatusCodes } from "http-status-codes";
import { Class, ClassStatus } from "../../../generated/client";
import { Prisma } from "@prisma/client";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";

export async function createClass(
  req: Request<{}, {}, any>,
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
  } = req.body;

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
      classStatus: ClassStatus.HIDDEN,
    },
  });

  res.status(StatusCodes.CREATED).json(createdClass);
}

export async function getPossibleInstructorIds(
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) {
  const { classRoom, groupNumber, date, time } = req.body;

  const allInstructorIds = await prisma.instructorsOnCourses.findMany({
    select: {
      instructorId: true,
    },
    distinct: ["instructorId"],
  });

  res.json(allInstructorIds);
}
