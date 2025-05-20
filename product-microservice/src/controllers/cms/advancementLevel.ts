import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { checkValidations } from "../../utils/errorHelpers";
import { AdvancementLevel } from "../../../generated/client";

export async function createAdvancementLevel(
  req: Request<object, object, AdvancementLevel>,
  res: Response,
) {
  checkValidations(validationResult(req));
  const { name, description } = req.body;
  const advancementLevel = await prisma.advancementLevel.create({
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.CREATED).json(advancementLevel);
}

export async function getAdvancementLevel(
  req: Request<{ id: string }, {}>,
  res: Response,
) {
  const id = parseInt(req.params.id);
  const advancementLevel = await prisma.advancementLevel.findUniqueOrThrow({
    where: {
      id,
    },
  });
  res.json(advancementLevel);
}

export async function getAdvancementLevelList(
  req: Request,
  res: Response<AdvancementLevel[]>,
  next: NextFunction,
) {
  const advancementLevels = await prisma.advancementLevel.findMany();
  res.json(advancementLevels);
}

export async function deleteAdvancementLevel(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);
  await prisma.advancementLevel.delete({
    where: {
      id,
    },
  });
  res.status(StatusCodes.NO_CONTENT).send();
}

export async function updateAdvancementLevel(
  req: Request<{ id: string }, {}, AdvancementLevel>,
  res: Response,
) {
  checkValidations(validationResult(req));
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const advancementLevel = await prisma.advancementLevel.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.OK).json(advancementLevel);
}
