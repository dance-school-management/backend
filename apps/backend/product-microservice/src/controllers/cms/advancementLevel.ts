import { AdvancementLevel, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";

export async function createAdvancementLevel(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(StatusCodes.BAD_REQUEST);
      next({ errors: result.array() });
      return;
    }
    const { name, description } = req.body;
    const advancementLevel = await prisma.danceCategory.create({
      data: {
        name,
        description,
      },
    });
    res.status(StatusCodes.CREATED).json(advancementLevel);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new prismaError(error);
    }
    throw error;
  }
}

export async function getAdvancementLevel(
  req: Request<{ id: string }, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);
  const advancementLevel = await prisma.advancementLevel.findUnique({
    where: {
      id,
    },
  });
  if(!advancementLevel) {
    throw new Error("Advancement Level doesn't exists.");
  }
  res.json(advancementLevel);
}

export async function getAdvancementLevelList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const advancementLevels = await prisma.advancementLevel.findMany();
  if(!advancementLevels) {
    throw new Error("There is zero advancement levels.");
  }
  res.json(advancementLevels);
}
