import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { Role } from "../../../generated/client";

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