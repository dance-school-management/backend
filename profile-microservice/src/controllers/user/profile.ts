import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { Profile } from "../../../generated/client";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";

export async function editProfile(
  req: Request<{}, {}, Profile> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  if (!req.user) {
    throw new UniversalError(
      StatusCodes.UNAUTHORIZED,
      "Problems with authentication",
      [],
    );
  }

  const { id, name, surname, description, photo_url } = req.body;

  if (!(req.user.id === id)) {
    throw new UniversalError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to edit another user's profile",
      [],
    );
  }

  const editedProfile = await prisma.profile.update({
    where: {
      id: id,
    },
    data: {
      name,
      surname,
      description,
      photo_url,
    },
  });

  res.status(StatusCodes.OK).json(editedProfile);
}
