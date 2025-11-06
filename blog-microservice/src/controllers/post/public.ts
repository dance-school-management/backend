import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { UniversalError } from "../../errors/UniversalError";

/**
 * Get all published posts (public)
 */
export async function getPublicPosts(
  req: Request<
    {},
    {},
    {},
    {
      page?: string;
      limit?: string;
      q?: string;
      tag?: string;
    }
  >,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const page = parseInt(req.query.page || "1", 10);
  const limit = Math.min(parseInt(req.query.limit || "10", 10), 100);
  const searchQuery = req.query.q;
  const tag = req.query.tag;

  const skip = (page - 1) * limit;

  const now = new Date();

  const where: any = {
    status: "published",
    publishedAt: {
      lte: now,
    },
  };

  if (tag) {
    where.tags = {
      has: tag,
    };
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { excerpt: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        // Pinned posts first (currently pinned: isPinned=true && pinnedUntil >= now)
        {
          isPinned: "desc",
        },
        // Then by publishedAt desc
        {
          publishedAt: "desc",
        },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        authorId: true,
        readingTime: true,
        isPinned: true,
        pinnedUntil: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  // Filter out posts that are no longer pinned (pinnedUntil < now)
  // Also ensure isPinned is set correctly based on pinnedUntil
  const filteredPosts = posts.map((post) => {
    if (post.isPinned && post.pinnedUntil && post.pinnedUntil < now) {
      // Post is no longer pinned
      return { ...post, isPinned: false, pinnedUntil: null };
    }
    return post;
  });

  // Sort: pinned posts first (where isPinned=true && pinnedUntil >= now), then by publishedAt desc
  filteredPosts.sort((a, b) => {
    const aIsCurrentlyPinned =
      a.isPinned && a.pinnedUntil && a.pinnedUntil >= now;
    const bIsCurrentlyPinned =
      b.isPinned && b.pinnedUntil && b.pinnedUntil >= now;

    if (aIsCurrentlyPinned && !bIsCurrentlyPinned) return -1;
    if (!aIsCurrentlyPinned && bIsCurrentlyPinned) return 1;

    // Both pinned or both not pinned - sort by publishedAt desc
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bDate - aDate;
  });

  res.status(StatusCodes.OK).json({
    data: filteredPosts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/**
 * Get single published post by ID or slug (public)
 */
export async function getPublicPostByIdOrSlug(
  req: Request<{ idOrSlug: string; }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;

  const now = new Date();

  const post = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
      status: "published",
      publishedAt: {
        lte: now,
      },
    },
  });

  if (!post) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found or not published",
      [],
    );
  }

  res.status(StatusCodes.OK).json(post);
}

