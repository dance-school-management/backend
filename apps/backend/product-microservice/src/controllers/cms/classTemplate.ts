import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { ClassTemplate } from "../../../generated/client";
import { checkValidations } from "../../utils/errorHelpers";

export async function createClassTemplate(
  req: Request<{}, {}, ClassTemplate>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const {
    courseId,
    name,
    description,
    price,
    currency,
    danceCategoryId,
    advancementLevelId,
    classType,
    scheduleTileColor,
  } = req.body;

  const createdClassTemplate = await prisma.classTemplate.create({
    data: {
      courseId,
      name,
      description,
      price,
      currency,
      danceCategoryId,
      advancementLevelId,
      classType,
      scheduleTileColor,
    },
  });

  res.status(StatusCodes.CREATED).json(createdClassTemplate);
}

export async function editClassTemplate(
  req: Request<{ id: string }, {}, ClassTemplate>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);
  const {
    courseId,
    name,
    description,
    price,
    currency,
    danceCategoryId,
    advancementLevelId,
    classType,
    scheduleTileColor,
  } = req.body;

  const editedClassTemplate = await prisma.classTemplate.update({
    where: {
      id: id,
    },
    data: {
      courseId,
      name,
      description,
      price,
      currency,
      danceCategoryId,
      advancementLevelId,
      classType,
      scheduleTileColor,
    },
  });

  res.status(StatusCodes.OK).json(editedClassTemplate);
}

export async function deleteClassTemplate(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  await prisma.classTemplate.delete({
    where: {
      id: id,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

export async function getClassTemplate(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  const theClassTemplate = await prisma.classTemplate.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  res.status(StatusCodes.OK).json(theClassTemplate);
}

export async function getAllClassTemplates(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const allClassTemplates = await prisma.classTemplate.findMany();

  res.status(StatusCodes.OK).json(allClassTemplates);
}
