import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { checkValidations } from "../../utils/errorHelpers";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { sendPushNotifications } from "../../utils/helpers";
import { expo } from "../..";
import Expo from "expo-server-sdk";

export async function getUserNotifications(
  req: Request<
    {},
    {},
    {},
    { dateFrom: string; dateTo: string; page?: number; limit?: number }
  > & { user?: any },
  res: Response,
) {
  checkValidations(validationResult(req));
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let dateFrom;
  let dateTo;
  if (req.query.dateFrom && req.query.dateTo) {
    dateFrom = new Date(req.query.dateFrom);
    dateTo = new Date(req.query.dateTo);
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: {
        ...(dateFrom &&
          dateTo && {
            sendDate: {
              gte: dateFrom,
              lte: dateTo,
            },
          }),
        notificationsOnUsers: {
          some: {
            userId: req.user?.id,
          },
        },
      },
      include: {
        notificationsOnUsers: {
          where: {
            userId: req.user?.id,
          },
          select: {
            hasBeenRead: true,
          },
          take: 1,
        },
      },
      skip,
      take: limit,
      orderBy: {
        sendDate: "desc",
      },
    }),
    prisma.notification.count({
      where: {
        ...(dateFrom &&
          dateTo && {
            sendDate: {
              gte: dateFrom,
              lte: dateTo,
            },
          }),
        notificationsOnUsers: {
          some: {
            userId: req.user?.id,
          },
        },
      },
    }),
  ]);

  const formattedNotifications = notifications.map((n) => ({
    ...n,
    hasBeenRead: n.notificationsOnUsers[0]?.hasBeenRead ?? false,
    notificationsOnUsers: undefined,
    createdBy: undefined,
  }));

  res.status(StatusCodes.OK).json({
    data: formattedNotifications,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getUserNotificationById(
  req: Request<{ id: string }> & { user?: any },
  res: Response,
) {
  checkValidations(validationResult(req));
  const { id } = req.params;
  const notification = await prisma.notification.findUnique({
    where: {
      id: Number(id),
      notificationsOnUsers: { some: { userId: req.user?.id } },
    },
    include: {
      notificationsOnUsers: {
        where: {
          userId: req.user?.id,
        },
      },
    },
  });

  if (!notification) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `Notification with id ${id} not found` });
    return;
  }

  const formattedNotification = {
    ...notification,
    hasBeenRead: notification?.notificationsOnUsers[0]?.hasBeenRead ?? false,
    notificationsOnUsers: undefined,
    createdBy: undefined,
  };

  res.status(StatusCodes.OK).json(formattedNotification);
}

export async function createNotifications(
  req: Request<
    {},
    {},
    {
      userIds: string[];
      title: string;
      body: string;
    }
  > & { user?: any },
  res: Response,
) {
  checkValidations(validationResult(req));

  const { userIds, title, body } = req.body;

  const notification = await prisma.notification.create({
    data: {
      body,
      title,
      isAutomatic: false,
      createdBy: req.user?.id,
      payload: {},
    },
  });

  const usersRegisteredForNotifications = (
    await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
        hasEnabledNotifications: true,
      },
    })
  ).map((user) => user.id);

  await prisma.notificationsOnUsers.createMany({
    data: usersRegisteredForNotifications.map((userId) => ({
      notificationId: notification.id,
      userId,
    })),
  });

  await sendPushNotifications(usersRegisteredForNotifications, title, body, {});

  res
    .status(StatusCodes.OK)
    .json({ message: "Notifications successfully created and sent" });
}

export async function updateNotificationsStatus(
  req: Request<{}, {}, { ids: number[]; hasBeenRead: boolean }> & {
    user?: any;
  },
  res: Response,
) {
  const { ids, hasBeenRead } = req.body;

  const result = await prisma.notificationsOnUsers.updateMany({
    where: {
      notificationId: {
        in: ids,
      },
      userId: req.user?.id,
    },
    data: {
      hasBeenRead,
    },
  });

  res.status(StatusCodes.OK).json({
    updatedNotifications: result.count,
  });
}

// export async function deleteNotification(req: Request, res: Response) {
//   checkValidations(validationResult(req));
//   const { id } = req.params;
//   await prisma.notification.delete({
//     where: { id: Number(id) },
//   });
//   res.status(StatusCodes.OK).json({ message: "Notification deleted" });
// }

export async function toggleEnableNotifications(
  req: Request<{}, {}, { enable: boolean }> & { user?: any },
  res: Response,
) {
  const { enable } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      id: req.user?.id,
    },
  });

  if (!user) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You are not registered for notifications",
      [],
    );
  }

  await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      hasEnabledNotifications: enable,
    },
  });

  res.status(StatusCodes.OK).json({ notificationsEnabilityStatus: enable });
}

export async function getIsRegisteredForNotifications(
  req: Request & { user?: any },
  res: Response,
) {
  const user = await prisma.user.findFirst({
    where: {
      id: req.user?.id,
    },
  });

  let isTokenValid = false;

  if (user?.token) isTokenValid = Expo.isExpoPushToken(user?.token);

  res.status(StatusCodes.OK).json({
    isRegistered: Boolean(user),
    hasEnabledNotifications: user?.hasEnabledNotifications,
    isRegisteredForPushNotifications: isTokenValid,
  });
}

export async function getNotifications(
  req: Request<
    {},
    {},
    {},
    {
      dateFrom: string;
      dateTo: string;
      page?: number;
      limit?: number;
      onlyOwned?: boolean;
    }
  > & { user?: any },
  res: Response,
) {
  checkValidations(validationResult(req));
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let dateFrom;
  let dateTo;
  if (req.query.dateFrom && req.query.dateTo) {
    dateFrom = new Date(req.query.dateFrom);
    dateTo = new Date(req.query.dateTo);
  }
  const onlyOwned = req.query.onlyOwned;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: {
        ...(dateFrom &&
          dateTo && {
            sendDate: {
              gte: dateFrom,
              lte: dateTo,
            },
          }),
        ...((onlyOwned || req.user?.role === "INSTRUCTOR") && {
          createdBy: req.user?.id,
        }),
      },
      skip,
      take: limit,
      orderBy: {
        sendDate: "desc",
      },
    }),
    prisma.notification.count({
      where: {
        ...(dateFrom &&
          dateTo && {
            sendDate: {
              gte: dateFrom,
              lte: dateTo,
            },
          }),
        ...((onlyOwned || req.user?.role === "INSTRUCTOR") && {
          createdBy: req.user?.id,
        }),
      },
    }),
  ]);

  res.status(StatusCodes.OK).json({
    data: notifications,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getNotificationById(
  req: Request<{ id: string }> & { user?: any },
  res: Response,
) {
  checkValidations(validationResult(req));
  const { id } = req.params;
  const notification = await prisma.notification.findUnique({
    where: {
      id: Number(id),
      ...(req.user?.role === "INSTRUCTOR" && {
        createdBy: req.user?.id,
      }),
    },
  });

  if (!notification) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `Notification with id ${id} not found` });
    return;
  }

  res.status(StatusCodes.OK).json(notification);
}
