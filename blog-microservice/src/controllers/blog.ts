import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/prisma";
import { checkValidations } from "../utils/errorHelpers";


export async function getBlogEntries(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const title = req.query.title as string | undefined;
    const createdAt = req.query.createdAt as string | undefined;
    const authors = req.query.authors as string[] | undefined;
    const tags = req.query.tags as string[] | undefined;

    const where = {
        ...(title && { title: { contains: title } }),
        ...(createdAt && { createdAt: { gte: new Date(createdAt as string) } }),
        ...(authors && {
            data: {
                path: ["authors"],
                array_contains: authors
            }
        }),
        ...(tags && {
            data: {
                path: ["tags"],
                array_contains: tags
            }
        }),
    };

    const [blogEntries, total] = await Promise.all([
        prisma.blog.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                {
                    createdAt: "desc"
                },
                {
                    title: "asc"
                }
            ]
        }),
        prisma.blog.count({
            where
        })
    ]);

    res.status(StatusCodes.OK).json({
        data: blogEntries,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    });
}

export async function getBlogEntryById(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const { id } = req.params;
    const blogEntry = await prisma.blog.findUnique({
        where: { id: Number(id) },
    });
    res.status(StatusCodes.OK).json(blogEntry);
}

export async function createBlogEntry(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const {
        title,
        data
    } = req.body;
    const blogEntry = await prisma.blog.create({
        data: {
            title,
            data
        }
    })
    res.status(StatusCodes.OK).json(blogEntry);
}

export async function updateBlogEntry(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const { id } = req.params;
    const { title, data } = req.body;
    const updatedData = {
        ...(title && { title }),
        ...(data && { data }),
    };
    const blogEntry = await prisma.blog.update({
        where: { id: Number(id) },
        data: updatedData
    });
    res.status(StatusCodes.OK).json(blogEntry);
}

export async function deleteBlogEntry(req: Request, res: Response) {
    checkValidations(validationResult(req));
    const { id } = req.params;
    const blogEntry = await prisma.blog.delete({
        where: { id: Number(id) },
    });
    res.status(StatusCodes.OK).json(blogEntry);
}