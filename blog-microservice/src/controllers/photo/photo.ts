import { Request, Response, NextFunction } from "express";
import {
  uploadPublicPhoto,
  deletePublicPhoto,
  uploadMultiplePublicPhotos,
} from "../../utils/aws-s3/crud";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../../errors/UniversalError";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";

async function createPhotoRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let uniquePath: string | null = null;
  if (req.file) {
    try {
      uniquePath = await uploadPublicPhoto(req.file);
    } catch (error) {
      throw new UniversalError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to upload photo",
        []
      );
    }
  } else {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Photo file is required",
      []
    );
  }
  const blogPhoto = await prisma.blogPhoto.create({
    data: { path: uniquePath! },
  });
  res.status(StatusCodes.CREATED).json(blogPhoto);
}

async function getPhotoRecord(req: Request, res: Response, next: NextFunction) {
  checkValidations(validationResult(req));
  const { id } = req.query;
  const photoRecord = await prisma.blogPhoto.findFirstOrThrow({
    where: { id: Number(id) },
  });
  res.json(photoRecord);
}

async function deletePhotoRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  checkValidations(validationResult(req));
  const { id } = req.query;
  let photoRecord;
  try {
    photoRecord = await prisma.blogPhoto.findFirstOrThrow({
      where: { id: Number(id) },
    });
  } catch {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      `Photo with ID ${id} does not exist`,
      []
    );
  }
  try {
    await deletePublicPhoto(photoRecord.path);
  } catch (error) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete photo from storage",
      []
    );
  }
  await prisma.blogPhoto.delete({
    where: { id: Number(id) },
  });
  res.status(StatusCodes.NO_CONTENT).send();
}

async function createMultiplePhotoRecords(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let uniquePaths: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    uniquePaths = await uploadMultiplePublicPhotos(req.files);
  } else {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Photo files are required",
      []
    );
  }

  await prisma.blogPhoto.createMany({
    data: uniquePaths.map((path) => ({ path })),
  });

  const blogPhotos = await prisma.blogPhoto.findMany({
    where: {
      path: {
        in: uniquePaths,
      },
    },
  });
  res.status(StatusCodes.CREATED).json(blogPhotos);
}

export {
  createPhotoRecord,
  getPhotoRecord,
  deletePhotoRecord,
  createMultiplePhotoRecords,
};
