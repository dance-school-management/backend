import { Request, Response } from "express";
import { Expo } from "expo-server-sdk";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";

export async function registerDevice(
  req: Request<{}, {}, { pushToken: string }> & { user?: any },
  res: Response,
) {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json("User is not authorized");
    return;
  }

  console.log(req.user.role);

  const { pushToken } = req.body;
  if (!Expo.isExpoPushToken(pushToken)) {
    res.status(StatusCodes.BAD_REQUEST).json("Invalid push token");
    return;
  }

  await prisma.pushToken.create({
    data: {
      token: pushToken,
      userId: req.user.id,
    },
  });
  res.sendStatus(StatusCodes.OK);
}
