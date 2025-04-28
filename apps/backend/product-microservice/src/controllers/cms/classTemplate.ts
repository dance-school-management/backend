import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";
import { Prisma } from "@prisma/client";

export async function createClassTemplate(
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      courseId,
      name,
      description,
      price,
      currency,
      danceCategoryId,
      advancementLevelId,
      classType,
      scheduleTileColor,
    } = req.body;
  
    const result = await prisma.classTemplate.create({
      data: {
        courseId,
        name,
        description,
        price,
        currency,
        danceCategoryId,
        advancementLevelId,
        classType,
        scheduleTileColor,
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
