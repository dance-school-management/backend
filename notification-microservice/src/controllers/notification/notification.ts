import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { checkValidations } from "../../utils/errorHelpers";
import prisma from "../../utils/prisma";
import { ExpoPushMessage } from "expo-server-sdk";
import { expo } from "../../index";
import { UniversalError } from "../../errors/UniversalError";

export async function getNotifications(
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
        tokens: {
          some: {
            userId: req.user?.id,
          },
        },
      },
      include: {
        tokens: {
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
        tokens: {
          some: {
            userId: req.user?.id,
          },
        },
      },
    }),
  ]);

  const formattedNotifications = notifications.map((n) => ({
    ...n,
    hasBeenRead: n.tokens[0]?.hasBeenRead ?? false,
    tokens: undefined,
  }));

  res.status(StatusCodes.OK).json({
    data: formattedNotifications,
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
  console.log("getNotificationById");
  const { id } = req.params;
  const notification = await prisma.notification.findUnique({
    where: { id: Number(id), tokens: { some: { userId: req.user?.id } } },
    include: {
      tokens: {
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
    hasBeenRead: notification?.tokens[0]?.hasBeenRead ?? false,
    tokens: undefined,
  };

  res.status(StatusCodes.OK).json(formattedNotification);
}

export async function createNotifications(
  req: Request<{}, {}, { userIds: string[]; title: string; body: string }>,
  res: Response,
) {
  checkValidations(validationResult(req));

  const { userIds, title, body } = req.body;

  const notification = await prisma.notification.create({
    data: {
      body,
      title,
      payload: {},
    },
  });

  for (const userId of userIds) {
    const isUserRegisteredForNotifications = Boolean(
      await prisma.pushToken.findFirst({
        where: {
          userId,
        },
      }),
    );
    if (isUserRegisteredForNotifications) {
      await prisma.notificationsOnTokens.create({
        data: {
          notificationId: notification.id,
          userId: userId,
        },
      });
    }
  }

  const pushTokens = await prisma.pushToken.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  const pushTokensMessages = userIds.map((uid) => {
    const token = pushTokens.find((pt) => pt.userId === uid)?.token;
    if (!token) return null;
    return { title, body, token };
  });

  const messages: ExpoPushMessage[] = pushTokensMessages
    .map((ptm) => {
      if (ptm)
        return {
          to: ptm.token,
          sound: "default",
          title: ptm.title,
          body: ptm.body,
        };
      else return null;
    })
    .filter((item) => item !== null);

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Error sending:", error);
    }
  }

  console.log("Push notifications sent");

  res
    .status(StatusCodes.OK)
    .json({ message: "Notifications successfully created and sent" });
}

export async function updateNotificationContent(
  req: Request<{ id: string }, {}, { title: string; body: string }>,
  res: Response,
) {
  checkValidations(validationResult(req));
  const { id } = req.params;
  const { title, body } = req.body;

  const data = {
    ...(title && { title }),
    ...(body && { body }),
  };

  const notification = await prisma.notification.update({
    where: { id: Number(id) },
    data,
  });

  const userIds = (
    await prisma.notificationsOnTokens.findMany({
      where: {
        notificationId: Number(id),
      },
    })
  ).map((item) => item.userId);

  const pushTokens = await prisma.pushToken.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  const pushTokensMessages = userIds.map((uid) => {
    const token = pushTokens.find((pt) => pt.userId === uid)?.token;
    if (!token) return null;
    return {
      title: "Notification update",
      body: "One of your notifications was updated",
      token,
    };
  });

  const messages: ExpoPushMessage[] = pushTokensMessages
    .map((ptm) => {
      if (ptm)
        return {
          to: ptm.token,
          sound: "default",
          title: ptm.title,
          body: ptm.body,
        };
      else return null;
    })
    .filter((item) => item !== null);

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Error sending:", error);
    }
  }

  res.status(StatusCodes.OK).json(notification);
}

export async function updateNotificationStatus(
  req: Request<{ id: string }, {}, { hasBeenRead: boolean }> & { user?: any },
  res: Response,
) {
  checkValidations(validationResult(req));
  const { id } = req.params;
  const { hasBeenRead } = req.body;

  const exists = Boolean(
    await prisma.notificationsOnTokens.findFirst({
      where: {
        userId: req.user?.id,
        notificationId: Number(id),
      },
    }),
  );

  if (!exists) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Failed to update notification status - notification not found",
      [],
    );
  }

  const notification = await prisma.notificationsOnTokens.update({
    where: {
      userId_notificationId: {
        userId: req.user?.id,
        notificationId: Number(id),
      },
    },
    data: {
      hasBeenRead,
    },
  });
  res.status(StatusCodes.OK).json(notification);
}

// export async function deleteNotification(req: Request, res: Response) {
//   checkValidations(validationResult(req));
//   const { id } = req.params;
//   await prisma.notification.delete({
//     where: { id: Number(id) },
//   });
//   res.status(StatusCodes.OK).json({ message: "Notification deleted" });
// }
