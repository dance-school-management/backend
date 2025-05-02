import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { Prisma, ClassTemplate } from "../../../generated/client";

export async function createClassTemplate(
  req: Request<{}, {}, ClassTemplate>,
  res: Response,
  next: NextFunction,
) {
  try {
    const expressValidationResult = validationResult(req);
    if (!expressValidationResult.isEmpty()) {
      res.status(StatusCodes.BAD_REQUEST);
      next({ errors: expressValidationResult.array() });
      return;
    }

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
