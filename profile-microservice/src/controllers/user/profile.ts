import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { Profile } from "../../../generated/client";
import { checkValidations, getWrongFields } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import logger from "../../utils/winston";
import { Prisma } from "../../../generated/client";
import { deletePublicPhoto, uploadPublicPhoto } from "../../utils/aws-s3/crud";

export async function editProfile(
  req: Request<{}, {}, Profile> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));
  const { name, surname, email, phone, description, favouriteDanceCategories } =
    req.body;

  const id = req.user.id;
  let photoPath: string | undefined;

  if (req.file) {
    photoPath = await uploadPublicPhoto(req.file);
  }

  let oldProfile: Profile | null = null;
  try {
    console.log("ID student,", id);
    oldProfile = await prisma.profile.findUniqueOrThrow({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new UniversalError(StatusCodes.NOT_FOUND, "Profile not found", []);
  }
  try {
    const editedProfile = await prisma.profile.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(surname && { surname }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(description && { description }),
        ...(photoPath && { photoPath }),
        ...(favouriteDanceCategories && { favouriteDanceCategories }),
      },
    });
    try {
      if (oldProfile.photoPath && photoPath) {
        await deletePublicPhoto(oldProfile.photoPath);
      }
    } catch (err: any) {
      logger.error({
        level: "error",
        message: `Unknown error deleting old photo: ${err.message}`,
      });
    }
    res.status(StatusCodes.OK).json(editedProfile);
  } catch (error) {
    if (photoPath) {
      await deletePublicPhoto(photoPath);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const fields = getWrongFields(error);
      throw new UniversalError(
        StatusCodes.BAD_REQUEST,
        "Error updating profile",
        fields || [],
      );
    }

    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error updating profile",
      [],
    );
  }
}

export async function getProfile(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const id = req.user.id;

  if (!id) {
    throw new UniversalError(
      StatusCodes.UNAUTHORIZED,
      "User id missing in request",
      [],
    );
  }

  const response = await prisma.profile.findFirst({
    where: {
      id,
    },
  });

  res.status(StatusCodes.OK).json({ userData: response });
}
