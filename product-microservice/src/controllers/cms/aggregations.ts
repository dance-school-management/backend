import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";

export async function getAllAdvancementLevelsAndDanceCategoriesAndClassrooms(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  try {
    const allDanceCategories = await prisma.danceCategory.findMany({});
    const allAdvancementLevels = await prisma.advancementLevel.findMany({});
    const allClassRooms = await prisma.classRoom.findMany({});

    const result = {
      advancementLevels: allAdvancementLevels,
      danceCategories: allDanceCategories,
      classRooms: allClassRooms,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (err: any) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve data due to server errors",
      [],
    );
  }
}
