import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { ClassTemplate } from "../../../generated/client";
import { checkValidations } from "../../utils/errorHelpers";
import { Warning } from "../../errors/Warning";
import { ClassType } from "../../../generated/client";
import { UniversalError } from "../../errors/UniversalError";

export async function createClassTemplate(
  req: Request<{}, {}, ClassTemplate & { isConfirmation: boolean }>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const {
    courseId,
    name,
    description,
    price,
    danceCategoryId,
    advancementLevelId,
    classType,
    isConfirmation,
  } = req.body;

  if (classType === ClassType.PRIVATE_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You can't create a private class from here",
      [],
    );
  }

  if (!isConfirmation) {
    const alreadyExistingClassTemplate = await prisma.classTemplate.findFirst({
      where: {
        name,
      },
    });
    if (alreadyExistingClassTemplate)
      throw new Warning(
        "There is already a class template with this name",
        StatusCodes.CONFLICT,
      );
  }

  const createdClassTemplate = await prisma.classTemplate.create({
    data: {
      courseId,
      name,
      description,
      price,
      danceCategoryId,
      advancementLevelId,
      classType,
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
    danceCategoryId,
    advancementLevelId,
    classType,
  } = req.body;

  if (classType === ClassType.PRIVATE_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You can't create a private class from here",
      [],
    );
  }

  const editedClassTemplate = await prisma.classTemplate.update({
    where: {
      id: id,
    },
    data: {
      courseId,
      name,
      description,
      price,
      danceCategoryId,
      advancementLevelId,
      classType,
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

  const classUsingIt = await prisma.class.findFirst({
    where: {
      classTemplateId: id,
    },
  });

  if (classUsingIt) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "There are existing classes using this class template",
      [],
    );
  }

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
    include: {
      danceCategory: true,
      advancementLevel: true,
      class: {
        include: {
          classRoom: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json(theClassTemplate);
}

export async function getAllClassTemplates(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const allClassTemplates = await prisma.classTemplate.findMany({
    include: {
      danceCategory: true,
      advancementLevel: true,
      class: {
        include: {
          classRoom: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json(allClassTemplates);
}
