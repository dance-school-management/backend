import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { prismaError } from "prisma-better-errors";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { ClassRoom } from "../../../generated/client";
import { StatusCodes } from "http-status-codes";

export async function createClassRoom(
  req: Request<{}, {}, ClassRoom>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { name, peopleLimit, description } = req.body;

  const createdClassRoom = await prisma.classRoom.create({
    data: {
      name,
      peopleLimit,
      description,
    },
  });

  res.status(StatusCodes.CREATED).json(createdClassRoom);
}
