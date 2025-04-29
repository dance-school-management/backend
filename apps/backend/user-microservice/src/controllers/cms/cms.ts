import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";
import { Prisma } from "../../../generated/client";

export async function registerUser(
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      username,
      password,
      email,
      phone,
      role,
      name,
      surname,
      description,
      photoUrl,
      dateOfStartWorking,
    } = req.body;

    const result = await prisma.user.create({
      data: {
        username,
        password,
        email,
        phone,
        role,
        name,
        surname,
        description,
        photoUrl,
        dateOfStartWorking,
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
