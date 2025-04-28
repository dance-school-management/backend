import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";
import { StatusCodes } from "http-status-codes";
import { Class, ClassStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

export async function createClass(
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      instructorIds,
      classroomId,
      groupNumber,
      startDate,
      endDate,
      peopleLimit,
      classTemplateId,
    }: {
      instructorIds: number[];
      classroomId: number;
      groupNumber: number;
      startDate: Date;
      endDate: Date;
      peopleLimit: number;
      classTemplateId: number;
    } = req.body;

    const result = await prisma.class.create({
      data: {
        classTemplateId: classTemplateId,
        groupNumber: groupNumber,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        peopleLimit: peopleLimit,
        classRoomId: classroomId,
        instructor: {
          create: instructorIds.map((instructorId: number) => ({
            instructorId,
          })),
        },
        classStatus: ClassStatus.HIDDEN,
      },
    });

    res.json(result);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new prismaError(error);
    }
    throw error;
  }
}
