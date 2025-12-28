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
import { ClassStatus } from "../../../generated/client";
import { CourseStatus } from "../../../generated/client";

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

  if (courseId) {
    const theCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
      },
    });

    if (!theCourse) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "Provided course not found",
        [],
      );
    }

    if (theCourse.courseStatus !== CourseStatus.HIDDEN) {
      throw new UniversalError(
        StatusCodes.CONFLICT,
        "You can't add a class template to a published course",
        [],
      );
    }
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
      price: Number(price.toFixed(2)),
      descriptionEmbedded: (await embed(description, false)).embeddingList,
    };

    esClient
      .index({
        index: "class_templates",
        id: String(createdClassTemplate.id),
        document: doc,
      })
      .catch((err: any) =>
        console.log(
          "Failed to replicate/edit class template to/in elasticsearch: ",
          err,
        ),
      );
  } catch (err) {
    console.log("Failed to replicate class template to elasticsearch: ", err);
  }

  res.status(StatusCodes.CREATED).json(createdClassTemplate);
}

export async function editClassTemplate(
  req: Request<
    { id: string },
    {},
    {
      name?: string;
      description?: string;
      price?: number;
      danceCategoryId?: number;
      advancementLevelId?: number;
      classType?: ClassType;
    }
  >,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);
  const {
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

  const theClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      id,
    },
  });

  if (!theClassTemplate) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template not found",
      [],
    );
  }

  const itsClasses = await prisma.class.findMany({
    where: {
      classTemplateId: id,
    },
  });

  const areSomeClassesPublished = itsClasses.some(
    (c) => c.classStatus !== ClassStatus.HIDDEN,
  );

  if (areSomeClassesPublished && price) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The class template is published, price cannot be changed",
      [{ field: "price", message: "Should not be provided" }],
    );
  }

  if (areSomeClassesPublished && danceCategoryId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The class template is published, danceCategoryId cannot be changed",
      [{ field: "danceCategoryId", message: "Should not be provided" }],
    );
  }

  if (areSomeClassesPublished && advancementLevelId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The class template is published, advancementLevelId cannot be changed",
      [{ field: "advancementLevelId", message: "Should not be provided" }],
    );
  }

  if (areSomeClassesPublished && classType) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The class template is published, classType cannot be changed",
      [{ field: "classType", message: "Should not be provided" }],
    );
  }

  const editedClassTemplate = await prisma.classTemplate.update({
    where: {
      id: id,
    },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(danceCategoryId !== undefined && { danceCategoryId }),
      ...(advancementLevelId !== undefined && { advancementLevelId })
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
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(danceCategory && { danceCategory }),
      ...(advancementLevel && { advancementLevel }),
      ...(description !== undefined && {
        descriptionEmbedded: (await embed(description, false)).embeddingList,
      }),
      ...(price && { price: price }),
    };

    esClient
      .update({
        index: "class_templates",
        id: String(id),
        doc: editedDoc,
      })
      .catch((err: any) =>
        console.log(
          "Failed to replicate/edit class template to/in elasticsearch: ",
          err,
        ),
      );
  } catch (err) {
    console.log("Failed to edit class template in elasticsearch: ", err);
  }

  res.status(StatusCodes.OK).json(editedClassTemplate);
}

export async function deleteClassTemplate(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  const theClassTemplate = await prisma.classTemplate.findFirst({
    where: {
      id,
    },
  });

  if (!theClassTemplate) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template not found",
      [],
    );
  }

  if (theClassTemplate.classType === ClassType.PRIVATE_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This class template has class type PRIVATE CLASS",
      [],
    );
  }

  const classesUsingIt = await prisma.class.findMany({
    where: {
      classTemplateId: id,
    },
  });

  if (classesUsingIt.some((c) => c.classStatus !== ClassStatus.HIDDEN)) {
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

  esClient
    .delete({ index: "class_templates", id: String(id) })
    .catch((err: any) =>
      console.log("Failed to delete class template from elasticsearch: ", err),
    );

  res.status(StatusCodes.NO_CONTENT).send();
}

export async function getClassTemplate(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  const theClassTemplate = await prisma.classTemplate.findFirst({
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

  if (!theClassTemplate) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class template not found",
      [],
    );
  }

  if (theClassTemplate.classType === ClassType.PRIVATE_CLASS) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This class template has class type PRIVATE CLASS",
      [],
    );
  }

  res.status(StatusCodes.OK).json(theClassTemplate);
}

export async function getAllClassTemplates(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const allClassTemplates = await prisma.classTemplate.findMany({
    where: {
      classType: {
        not: ClassType.PRIVATE_CLASS,
      },
      courseId: null,
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

  res.status(StatusCodes.OK).json(allClassTemplates);
}
