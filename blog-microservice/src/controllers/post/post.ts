import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { UniversalError } from "../../errors/UniversalError";
import { generateSlug, generateUniqueSlug } from "../../utils/slug";
import { calculateReadingTime } from "../../utils/readingTime";
import { PostStatus } from "../../../generated/client";

interface CreatePostBody {
  title: string;
  content: string;
  excerpt: string;
  tags?: string[];
  status?: PostStatus;
}

interface UpdatePostBody {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  status?: PostStatus;
}

interface PublishPostBody {
  publishedAt?: string;
}

interface PinPostBody {
  pinnedUntil: string;
}

/**
 * Create a new blog post
 */
export async function createPost(
  req: Request<{}, {}, CreatePostBody> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { title, content, excerpt, tags = [], status = "draft" } = req.body;
  const authorId = req.user?.id;

  if (!authorId) {
    throw new UniversalError(
      StatusCodes.UNAUTHORIZED,
      "User context not found",
      [],
    );
  }

  // Generate slug from title
  const baseSlug = generateSlug(title);
  const existingSlugs = await prisma.blogPost.findMany({
    select: { slug: true },
  });
  const slug = generateUniqueSlug(
    baseSlug,
    existingSlugs.map((p) => p.slug),
  );

  // Calculate reading time
  const readingTime = calculateReadingTime(content);

  // Set publishedAt if status is published
  const publishedAt = status === "published" ? new Date() : null;

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      tags: tags || [],
      status,
      authorId: authorId,
      readingTime,
      isPinned: false,
      pinnedUntil: null,
      publishedAt,
    },
  });

  res.status(StatusCodes.CREATED).json(post);
}

/**
 * Update a blog post (admin only)
 */
export async function updatePost(
  req: Request<{ idOrSlug: string; }, {}, UpdatePostBody> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;
  const { title, content, excerpt, tags, status } = req.body;

  // Find post by ID or slug
  const existingPost = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
    },
  });

  if (!existingPost) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found",
      [],
    );
  }

  // Prepare update data
  const updateData: any = {};

  if (title !== undefined) {
    updateData.title = title;
    // If title changes, update slug
    if (title !== existingPost.title) {
      const baseSlug = generateSlug(title);
      const existingSlugs = await prisma.blogPost.findMany({
        where: { id: { not: existingPost.id } },
        select: { slug: true },
      });
      updateData.slug = generateUniqueSlug(
        baseSlug,
        existingSlugs.map((p) => p.slug),
      );
    }
  }

  if (content !== undefined) {
    updateData.content = content;
    // Recalculate reading time if content changes
    updateData.readingTime = calculateReadingTime(content);
  }

  if (excerpt !== undefined) {
    updateData.excerpt = excerpt;
  }

  if (tags !== undefined) {
    updateData.tags = tags;
  }

  if (status !== undefined) {
    updateData.status = status;
    // If status changes to published and publishedAt is null, set it
    if (status === "published" && !existingPost.publishedAt) {
      updateData.publishedAt = new Date();
    }
    // If status changes to draft, clear publishedAt
    if (status === "draft") {
      updateData.publishedAt = null;
    }
  }

  updateData.updatedAt = new Date();

  const updatedPost = await prisma.blogPost.update({
    where: { id: existingPost.id },
    data: updateData,
  });

  res.status(StatusCodes.OK).json(updatedPost);
}

/**
 * Publish a post
 */
export async function publishPost(
  req: Request<{ idOrSlug: string; }, {}, PublishPostBody> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;
  const { publishedAt } = req.body;

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
    },
  });

  if (!existingPost) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found",
      [],
    );
  }

  // If already published, return 204
  if (existingPost.status === "published") {
    res.status(StatusCodes.NO_CONTENT).send();
    return;
  }

  const publishDate = publishedAt ? new Date(publishedAt) : new Date();

  await prisma.blogPost.update({
    where: { id: existingPost.id },
    data: {
      status: "published",
      publishedAt: publishDate,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

/**
 * Unpublish a post
 */
export async function unpublishPost(
  req: Request<{ idOrSlug: string; }, {}, {}> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
    },
  });

  if (!existingPost) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found",
      [],
    );
  }

  // If already draft, return 204
  if (existingPost.status === "draft") {
    res.status(StatusCodes.NO_CONTENT).send();
    return;
  }

  await prisma.blogPost.update({
    where: { id: existingPost.id },
    data: {
      status: "draft",
      publishedAt: null,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

/**
 * Pin a post
 */
export async function pinPost(
  req: Request<{ idOrSlug: string; }, {}, PinPostBody> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;
  const { pinnedUntil } = req.body;

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
    },
  });

  if (!existingPost) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found",
      [],
    );
  }

  // If already pinned, return 204
  if (existingPost.isPinned) {
    res.status(StatusCodes.NO_CONTENT).send();
    return;
  }

  await prisma.blogPost.update({
    where: { id: existingPost.id },
    data: {
      isPinned: true,
      pinnedUntil: new Date(pinnedUntil),
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

/**
 * Unpin a post
 */
export async function unpinPost(
  req: Request<{ idOrSlug: string; }, {}, {}> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
    },
  });

  if (!existingPost) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found",
      [],
    );
  }

  // If already unpinned, return 204
  if (!existingPost.isPinned) {
    res.status(StatusCodes.NO_CONTENT).send();
    return;
  }

  await prisma.blogPost.update({
    where: { id: existingPost.id },
    data: {
      isPinned: false,
      pinnedUntil: null,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

/**
 * Delete a post
 */
export async function deletePost(
  req: Request<{ idOrSlug: string; }, {}, {}> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
    },
  });

  if (!existingPost) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found",
      [],
    );
  }

  await prisma.blogPost.delete({
    where: { id: existingPost.id },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}

/**
 * Get all posts (admin view - includes drafts and published)
 */
export async function getAllPosts(
  req: Request<
    {},
    {},
    {},
    {
      page?: string;
      limit?: string;
      status?: string;
      q?: string;
    }
  > & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const page = parseInt(req.query.page || "1", 10);
  const limit = Math.min(parseInt(req.query.limit || "10", 10), 100);
  const status = req.query.status as PostStatus | undefined;
  const searchQuery = req.query.q;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { excerpt: { contains: searchQuery, mode: "insensitive" } },
      { content: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
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

  res.status(StatusCodes.OK).json({
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/**
 * Get single post by ID or slug (admin view)
 */
export async function getPostByIdOrSlug(
  req: Request<{ idOrSlug: string; }, {}, {}> & { user?: any; },
  res: Response,
  next: NextFunction,
) {
  checkValidations(validationResult(req));

  const { idOrSlug } = req.params;

  const post = await prisma.blogPost.findFirst({
    where: {
      OR: [
        { id: !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : undefined },
        { slug: idOrSlug },
      ],
    },
  });

  if (!post) {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      "Post not found",
      [],
    );
  }

  res.status(StatusCodes.OK).json(post);
}

