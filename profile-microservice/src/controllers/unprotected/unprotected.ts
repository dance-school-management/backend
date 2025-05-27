import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { Profile, Role } from "../../../generated/client";

export async function getAllInstructors(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const allInstructors = await prisma.profile.findMany({
    where: {
      role: Role.INSTRUCTOR,
    },
  });

  const result = {
    instructors: allInstructors,
  };

  res.status(StatusCodes.OK).json(result);
}

export async function getInstructor(
  req: Request<Profile>,
  res: Response,
  next: NextFunction,
) {
  const instructor = await prisma.profile.findUnique({
    where: {
      id: req.params.id,
      role: Role.INSTRUCTOR,
    },
  });
  res.status(StatusCodes.OK).json(instructor);
}
