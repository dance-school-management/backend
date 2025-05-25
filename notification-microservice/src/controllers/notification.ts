import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/prisma";
import { checkValidations } from "../utils/errorHelpers";
import { ProductType } from "../../generated/client";


export async function getNotifications(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { productId, productType, userId, sendDate, hasBeenRead } = req.query;
    
    const where = {
        ...(productId && { productId: Number(productId) }),
        ...(productType && { productType: ProductType[productType as keyof typeof ProductType] }),
        ...(userId && { userId: Number(userId) }),
        ...(sendDate && { sendDate: {
                gte: new Date(`${sendDate.toString().split("T")[0]}T00:00:00Z`),
                lte: new Date(`${sendDate.toString().split("T")[0]}T23:59:59Z`)
        } }),
        ...(hasBeenRead && { hasBeenRead: hasBeenRead === "true" })
    }

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                sendDate: "desc"
            }
        }),
        prisma.notification.count({ where })
    ])

    res.status(StatusCodes.OK).json({
        data: notifications,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    })
}

export async function getNotificationById(req: Request, res: Response) {
    checkValidations(validationResult(req));
    console.log("getNotificationById");
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({
        where: { id: Number(id) }
    });
    if (!notification) {
        res.status(StatusCodes.NOT_FOUND).json({ message: `Notification with id ${id} not found` });
        return;
    }
    res.status(StatusCodes.OK).json(notification);
}

export async function createNotification(req: Request, res: Response) {
    checkValidations(validationResult(req));

    const {
        productId,
        productType,
        userId,
        title,
        description
    } = req.body;

    const notification = await prisma.notification.create({
        data: {
            productId,
            productType,
            userId,
            title,
            description
        }
    });
    res.status(StatusCodes.OK).json(notification);
}

export async function updateNotificationContent(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const { id } = req.params;
    const { title, description } = req.body;

    const data = {
        ...(title && { title }),
        ...(description && { description })
    };

    const notification = await prisma.notification.update({
        where: { id: Number(id) },
        data
    });
    res.status(StatusCodes.OK).json(notification);
}

export async function updateNotificationStatus(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const { id } = req.params;
    const { hasBeenRead } = req.body;

    const notification = await prisma.notification.update({
        where: { id: Number(id) },
        data: {
            hasBeenRead
        }
    });
    res.status(StatusCodes.OK).json(notification);
}

export async function deleteNotification(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const { id } = req.params;
    await prisma.notification.delete({
        where: { id: Number(id) }
    });
    res.status(StatusCodes.OK).json({ message: "Notification deleted" });
}