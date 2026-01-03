import { DanceCategory } from "../../../generated/client";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { checkValidations } from "../../utils/errorHelpers";
import { deletePublicPhoto, uploadPublicPhoto } from "../../utils/aws-s3/crud";
import { s3Endpoint } from "../../utils/aws-s3/s3Client";
import "dotenv/config";
import { UniversalError } from "../../errors/UniversalError";

export async function createDanceCategory(
  req: Request<{}, {}, DanceCategory>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));
  const { name, description } = req.body;
  let uniquePath: string | null = null;
  if (req.file) {
    uniquePath = await uploadPublicPhoto(req.file);
  }
  const danceCategory = await prisma.danceCategory.create({
    data: {
      name,
      description,
      photoPath: uniquePath,
    },
  });
  res.status(StatusCodes.CREATED).json(danceCategory);
}

export async function getDanceCategoryList(
  req: Request<{}, {}, DanceCategory>,
  res: Response,
  next: NextFunction,
) {
  const danceCategories = await prisma.danceCategory.findMany({
    select: {
      id: true,
      name: true,
      photoPath: true,
      description: true,
    },
  });
  const mappedWithRemotePart = danceCategories.map((category) => {
    if (category.photoPath) {
      category.photoPath = `${s3Endpoint}${category.photoPath}`;
    }
    return category;
  });
  res.json(mappedWithRemotePart);
}

export async function getDanceCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);
  const danceCategory = await prisma.danceCategory.findUniqueOrThrow({
    where: {
      id,
    },
  });
  let photoPath: string | null = null;
  if (danceCategory?.photoPath) {
    //const pathName = path.resolve(danceCategory.photoPath);
    photoPath = `${s3Endpoint}${danceCategory.photoPath}`;
  }
  res.json({
    id,
    photoPath: photoPath,
    name: danceCategory.name,
    description: danceCategory.description,
  });
}

export async function deleteDanceCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  const courseUsingIt = await prisma.course.findFirst({
    where: {
      danceCategoryId: id,
    },
  });

  const classTemplateUsingIt = await prisma.classTemplate.findFirst({
    where: {
      danceCategoryId: id,
    },
  });

  if (courseUsingIt || classTemplateUsingIt) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This dance category is in use",
      [],
    );
  }

  const OldDanceCategory = await prisma.danceCategory.findUniqueOrThrow({
    where: {
      id,
    },
  });
  
  if (OldDanceCategory.photoPath) {
    await deletePublicPhoto(OldDanceCategory.photoPath);
  }

  await prisma.danceCategory.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

export async function updateDanceCategory(
  req: Request<{ id: string }, {}, DanceCategory>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  let uniquePath: string | null = null;
  if (req.file) {
    uniquePath = await uploadPublicPhoto(req.file);
  }

  const OldDanceCategory = await prisma.danceCategory.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // Delete old photo if a new one is uploaded
  if (
    req.file &&
    OldDanceCategory.photoPath &&
    uniquePath !== OldDanceCategory.photoPath
  ) {
    await deletePublicPhoto(OldDanceCategory.photoPath);
  }

  const danceCategory = await prisma.danceCategory.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      photoPath: uniquePath || OldDanceCategory.photoPath,
    },
  });
  res.status(StatusCodes.OK).json(danceCategory);
}
