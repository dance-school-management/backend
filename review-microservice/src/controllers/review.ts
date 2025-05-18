import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/prisma";
import { checkValidations } from "../utils/errorHelpers";


export async function getReviews(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const authorId = req.query.authorId as string | undefined;
    const courseTemplateId = req.query.courseTemplateId as string | undefined;
    const stars = req.query.stars as string | undefined;
    const username = req.query.username as string | undefined;
    const createdAt = req.query.createdAt as string | undefined;

    const where = {
        ...(authorId && { authorId: Number(authorId) }),
        ...(courseTemplateId && { courseTemplateId: Number(courseTemplateId) }),
        ...(stars && { stars: {
            gte: Number(stars)
        } }),
        ...(username && { 
            author: {
                path: ["username"],
                string_contains: username
            }
         }),
        ...(createdAt && { createdAt: {
            gte: new Date(createdAt as string)
        } }),
    };

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                {
                    stars: "desc"
                },
                {
                    createdAt: "desc"
                }
            ]
        }),
        prisma.review.count({
            where
        })
    ]);

    res.status(StatusCodes.OK).json({
        data: reviews,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    });
}

export async function getReviewById(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const reviewId = Number(req.params.id);

    const review = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    });

    res.status(StatusCodes.OK).json(review);
}   

export async function createReview(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const { authorId, courseTemplateId, text, stars, author } = req.body;

    const review = await prisma.review.create({
        data: {
            authorId,
            courseTemplateId,
            text,
            stars,
            author
        }
    });

    res.status(StatusCodes.CREATED).json(review);
}

export async function updateReview(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const reviewId = Number(req.params.id);
    const { text, stars } = req.body;

    const updatedData = {
        ...(text && { text }),
        ...(stars && { stars })
    };

    const review = await prisma.review.update({
        where: {
            id: reviewId
        },
        data: updatedData
    });

    res.status(StatusCodes.OK).json(review);
}

export async function deleteReview(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const reviewId = Number(req.params.id);

    const review = await prisma.review.delete({
        where: {
            id: reviewId
        }
    });

    res.status(StatusCodes.OK).json(review);
}