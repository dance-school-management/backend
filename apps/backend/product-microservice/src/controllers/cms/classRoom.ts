import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { prismaError } from "prisma-better-errors";

export async function createClassRoom(
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, peopleLimit, description } = req.body;

    const result = await prisma.classRoom.create({
      data: {
        name,
        peopleLimit,
        description,
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
