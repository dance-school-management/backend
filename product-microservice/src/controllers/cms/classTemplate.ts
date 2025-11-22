import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { ClassTemplate } from "../../../generated/client";
import { checkValidations } from "../../utils/errorHelpers";
import { Warning } from "../../errors/Warning";
import { ClassType } from "../../../generated/client";
import { UniversalError } from "../../errors/UniversalError";
import { ClassTemplateDocument, esClient } from "../../elasticsearch/client";
import { embed } from "../../grpc/client/aiCommunication/embed";

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
    currency,
    danceCategoryId,
    advancementLevelId,
    classType,
    scheduleTileColor,
    isConfirmation,
  } = req.body;

  const price = req.body.price as unknown as number;

  if (
    courseId &&
    (classType === ClassType.PRIVATE_CLASS ||
      classType === ClassType.THEME_PARTY)
  ) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template with class type 'private class' or 'theme_party' cannot be binded to a course",
      [],
    );
  }

  if (!courseId && classType === ClassType.GROUP_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template with class type 'group class' must be binded to a course",
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
      currency,
      danceCategoryId,
      advancementLevelId,
      classType,
      scheduleTileColor,
    },
  });

  try {
    let danceCategory = null;
    if (danceCategoryId)
      danceCategory = await prisma.danceCategory.findFirst({
        where: {
          id: danceCategoryId,
        },
      });
    let advancementLevel = null;
    if (advancementLevelId)
      advancementLevel = await prisma.advancementLevel.findFirst({
        where: {
          id: advancementLevelId,
        },
      });

    const doc: ClassTemplateDocument = {
      name,
      description,
      danceCategory,
      advancementLevel,
      price: price,
      descriptionEmbedded: (await embed(description, false)).embeddingList,
    };

    await esClient.index({
      index: "class_templates",
      id: String(createdClassTemplate.id),
      document: doc,
    });
  } catch (err) {
    console.error("Failed to replicate class template to elasticsearch: ", err);
  }

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
    currency,
    danceCategoryId,
    advancementLevelId,
    classType,
    scheduleTileColor,
  } = req.body;

  const price = req.body.price as unknown as number;

  if (
    courseId &&
    (classType === ClassType.PRIVATE_CLASS ||
      classType === ClassType.THEME_PARTY)
  ) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template with class type 'private class' or 'theme_party' cannot be binded to a course",
      [],
    );
  }

  if (!courseId && classType === ClassType.GROUP_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template with class type 'group class' must be binded to a course",
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
      currency,
      danceCategoryId,
      advancementLevelId,
      classType,
      scheduleTileColor,
    },
  });
  try {
    let danceCategory = null;
    if (danceCategoryId)
      danceCategory = await prisma.danceCategory.findFirst({
        where: {
          id: danceCategoryId,
        },
      });
    let advancementLevel = null;
    if (advancementLevelId)
      advancementLevel = await prisma.advancementLevel.findFirst({
        where: {
          id: advancementLevelId,
        },
      });

    const editedDoc: ClassTemplateDocument = {
      name,
      description,
      danceCategory,
      advancementLevel,
      descriptionEmbedded: (await embed(description, false)).embeddingList,
      price: price,
    };

    await esClient.index({
      index: "class_templates",
      id: String(id),
      document: editedDoc,
    });
  } catch (err) {
    console.error("Failed to edit class template in elasticsearch: ", err);
  }

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