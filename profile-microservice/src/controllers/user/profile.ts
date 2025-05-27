import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { Profile } from "../../../generated/client";
import { checkValidations, getWrongFields } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import logger from "../../utils/winston";
import { Prisma } from "../../../generated/client";

export async function editProfile(
  req: Request<{}, {}, Profile> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));
  const { name, surname, email, phone, description, favouriteDanceCategories } =
    req.body;

  const id = req.user.id;
  const photoPath = req.file ? req.file.path : undefined;

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
        const oldPhotoPath = path.resolve(oldProfile.photoPath);
        fs.unlink(oldPhotoPath, (err: any) => {
          if (err) {
            logger.error({
              level: "error",
              message: `Error deleting old photo: ${err.message}`,
            });
          }
        });
      }
    } catch (err: any) {
      logger.error({
        level: "error",
        message: `Unknown error deleting old photo: ${err.message}`,
      });
    }
    res.status(StatusCodes.OK).json(editedProfile);
  } catch (error) {
    if (oldProfile.photoPath && photoPath) {
      const oldPhotoPath = path.resolve(oldProfile.photoPath);
      fs.unlink(oldPhotoPath, (err: any) => {
        if (err) {
          logger.error({
            level: "error",
            message: `Profile update failed, also error deleting added new phoy: ${err.message}`,
          });
        }
      });
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
