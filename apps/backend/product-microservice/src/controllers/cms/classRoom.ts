import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "../../../generated/client";
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

export async function editClassRoom(
  req: Request<{ id: string }, {}, ClassRoom>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const id = parseInt(req.params.id);
  const { name, peopleLimit, description } = req.body;

  const editedClassRoom = await prisma.classRoom.update({
    where: {
      id: id,
    },
    data: {
      name,
      peopleLimit,
      description,
    },
  });

  res.status(StatusCodes.OK).json(editedClassRoom);
}

export async function deleteClassRoom(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  await prisma.classRoom.delete({
    where: {
      id: id,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

export async function getClassRoom(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  const theClassRoom = await prisma.classRoom.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  res.status(StatusCodes.OK).json(theClassRoom);
}

export async function getAllClassRooms(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const allClassRooms = await prisma.classRoom.findMany();

  res.status(StatusCodes.OK).json(allClassRooms);
}
