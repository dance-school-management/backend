import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { getOnlyDate } from "../../utils/date";
import { ClassStatus } from "@prisma/client";

export async function dailySchedule(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { date, studentId, filters } = req.body;

  const inputDate = new Date(date);
  const startOfDay = new Date(inputDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(inputDate);
  endOfDay.setHours(23, 59, 59, 999);

  const classes = await prisma.class.findMany({
    relationLoadStrategy: "join",
    include: {
      classTemplate: true,
      classRoom: true,
      student: true,
    },
    where: {
      startDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      classStatus: {
        notIn: [ClassStatus.HIDDEN, ClassStatus.CANCELLED],
      },
    },
  });

  const result = {
    classes: classes.map((cls) => ({
      id: cls.id,
      name: cls.classTemplate.name,
      startDate: cls.startDate,
      endDate: cls.endDate,
      status: cls.classStatus,
      classroom: cls.classRoom.name,
      isEnroled: studentId in cls.student,
    })),
  };

  res.status(200).json(result);
}

export async function infos(req: Request, res: Response, next: NextFunction) {
  const { studentId } = req.body;

  const infoss = await prisma.class.findMany({
    relationLoadStrategy: "join",
    include: {
      student: true,
      classTemplate: true,
    },
    where: {
      student: {
        some: {
          studentId: studentId,
        },
      },
      classStatus: {
        in: [ClassStatus.CANCELLED, ClassStatus.POSTPONED, ClassStatus.MAKE_UP],
      },
    },
  });

  const result = {
    infos: infoss.map((info) => ({
      className: info.classTemplate.name,
      classStatus: info.classStatus,
      startDate: info.startDate,
    })),
  };

  res.status(200).json(result);
}
