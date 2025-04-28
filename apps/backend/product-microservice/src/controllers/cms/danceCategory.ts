import { DanceCategory, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";

export async function createDanceCategory(
  req: Request<{}, {}, DanceCategory>,
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
    let photoPath: string | undefined = undefined;
    if (req.file) {
      photoPath = req.file.path;
    }

    const danceCategory = await prisma.danceCategory.create({
      data: {
        name,
        description,
        photoPath,
      },
    });
    res.status(StatusCodes.CREATED).json(danceCategory);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new prismaError(error);
    }
    throw error;
  }
}

export async function getDanceCategoryList(
  req: Request<{}, {}, DanceCategory>,
  res: Response,
  next: NextFunction,
) {
  const danceCategories = await prisma.danceCategory.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  res.json(danceCategories);
}

export async function getDanceCategory(
  req: Request<{ id: string }, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);
  const danceCategory = await prisma.danceCategory.findUnique({
    where: {
      id,
    },
  });
  if (!danceCategory) {
    throw new Error("Dance category doesn't exists.");
  }
  if (danceCategory?.photoPath) {
    //const pathName = path.resolve(danceCategory.photoPath);
    res.json({
      id,
      photoPath: danceCategory.photoPath,
      name: danceCategory.name,
      description: danceCategory.description,
    });
  }
}

export async function deleteDanceCategory(
  req: Request<{}, {}, DanceCategory>,
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
    const { id } = req.body;
    const danceCategory = await prisma.danceCategory.delete({
      where: {
        id,
      },
    });
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new prismaError(error);
    }
    throw error;
  }
}
