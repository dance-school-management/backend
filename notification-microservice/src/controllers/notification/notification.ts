import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { checkValidations } from "../../utils/errorHelpers";
import prisma from "../../utils/prisma";

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

  const userId = req.user?.id;

  const where = {
    ...(dateFrom &&
      dateTo && {
        sendDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      }),
    ...(userId && { userId: req.user.id }),
  };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        sendDate: "desc",
      },
    }),
    prisma.notification.count({ where }),
  ]);

  res.status(StatusCodes.OK).json({
    data: notifications,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getNotificationById(req: Request, res: Response) {
  checkValidations(validationResult(req));
  console.log("getNotificationById");
  const { id } = req.params;
  const notification = await prisma.notification.findUnique({
    where: { id: Number(id) },
  });
  if (!notification) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `Notification with id ${id} not found` });
    return;
  }
  res.status(StatusCodes.OK).json(notification);
}

// export async function createNotification(req: Request, res: Response) {
//   checkValidations(validationResult(req));

//   const { productId, productType, userId, title, description } = req.body;

//   const notification = await prisma.notification.create({
//     data: {
//       productId,
//       productType,
//       userId,
//       title,
//       description,
//     },
//   });
//   res.status(StatusCodes.OK).json(notification);
// }

// export async function updateNotificationContent(req: Request, res: Response) {
//   checkValidations(validationResult(req));
//   const { id } = req.params;
//   const { title, description } = req.body;

//   const data = {
//     ...(title && { title }),
//     ...(description && { description }),
//   };

//   const notification = await prisma.notification.update({
//     where: { id: Number(id) },
//     data,
//   });
//   res.status(StatusCodes.OK).json(notification);
// }

export async function updateNotificationStatus(req: Request, res: Response) {
  checkValidations(validationResult(req));
  const { id } = req.params;
  const { hasBeenRead } = req.body;

  const notification = await prisma.notification.update({
    where: { id: Number(id) },
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
