import {
  AdvancementLevel,
  Course,
  CourseStatus,
  DanceCategory,
  Prisma,
} from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/prisma";
import { prismaError } from "prisma-better-errors";
export async function createCourse(
  req: Request<{}, {}, Course>,
  res: Response,
) {
  const { name, description, danceCategoryId, advancementLevelId } = req.body;
  const course = await prisma.course.create({
    data: {
      name,
      description,
      danceCategoryId,
      advancementLevelId,
      courseStatus: CourseStatus.HIDDEN
    },
  });
}

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
    const danceCategory = await prisma.danceCategory.create({
      data: {
        name,
        description,
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

export function createadvancementLevel(
  req: Request<{}, {}, AdvancementLevel>,
  res: Response,
) {
  //TODO
}

export function deleteAdvancementLevel(
  req: Request<{}, {}, AdvancementLevel>,
  res: Response,
) {
  //TODO
}

export function test(req: Request, res: Response) {
  res.send("hello test");
}

export function testing_post(
  req: Request<{}, {}, { test: string }>,
  res: Response,
) {
  res.send(`hello testing ${req.body.test}`);
}
