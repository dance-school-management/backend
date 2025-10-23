import { Request, Response } from "express";
import { Expo } from "expo-server-sdk";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";

export async function register(
  req: Request<{}, {}, { pushToken?: string }> & { user?: any },
  res: Response,
) {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json("User is not authorized");
    return;
  }

  const { pushToken } = req.body;

  if (pushToken && !Expo.isExpoPushToken(pushToken)) {
    res.status(StatusCodes.BAD_REQUEST).json("Invalid push token");
    return;
  }

  await prisma.user.upsert({
    where: {
      id: req.user?.id,
    },
    create: {
      id: req.user?.id,
      ...(pushToken && { token: pushToken }),
    },
    update: {
      ...(pushToken && { token: pushToken }),
    },
  });

  res.status(StatusCodes.OK).json({
    message: `Successfully registered for notifications${pushToken ? " and push notifications" : ""}`,
  });
}
