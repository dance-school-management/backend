import { DanceCategory } from "../../../generated/client";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { checkValidations } from "../../utils/errorHelpers";
import fs from "fs";
import path from "path";
import logger from "../../utils/winston";

export async function createDanceCategory(
  req: Request<{}, {}, DanceCategory>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));
  const { name, description } = req.body;
  let photoPath: string | undefined = undefined;
  if (req.file) {
    photoPath = req.file.path;
  }
  const danceCategory = await prisma.danceCategory.create({
    data: {
      name,
      description,
      photoPath,
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
  res.json(danceCategories);
}

export async function getDanceCategory(
  req: Request<{ id: string; }>,
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
    photoPath = danceCategory.photoPath;
  }
  res.json({
    id,
    photoPath: photoPath,
    name: danceCategory.name,
    description: danceCategory.description,
  });
}

export async function deleteDanceCategory(
  req: Request<{ id: string; }>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);
  const OldDanceCategory = await prisma.danceCategory.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (OldDanceCategory.photoPath) {
    const oldPhotoPath = path.resolve(OldDanceCategory.photoPath);
    fs.unlink(oldPhotoPath, (err: any) => {
      if (err) {
        logger.error({
          level: "error",
          message: `Error deleting file: ${err.message}`,
        });
      }
    });
  }
  const danceCategory = await prisma.danceCategory.delete({
    where: {
      id,
    },
  });
  res.status(StatusCodes.NO_CONTENT).send();
}

export async function updateDanceCategory(
  req: Request<{ id: string; }, {}, DanceCategory>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  let photoPath: string | undefined = undefined;
  if (req.file) {
    photoPath = req.file.path;
  }

  const OldDanceCategory = await prisma.danceCategory.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (OldDanceCategory.photoPath && !req.file) {
    photoPath = OldDanceCategory.photoPath;
  } else if (OldDanceCategory.photoPath) {
    const oldPhotoPath = path.resolve(OldDanceCategory.photoPath);
    fs.unlink(oldPhotoPath, (err: any) => {
      if (err) {
        logger.error({
          level: "error",
          message: `Error deleting file: ${err.message}`,
        });
      }
    });
  }
  const danceCategory = await prisma.danceCategory.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      photoPath,
    },
  });
  res.status(StatusCodes.OK).json(danceCategory);
}
