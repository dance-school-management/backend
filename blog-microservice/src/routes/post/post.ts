import { Router } from "express";
import {
  createPost,
  updatePost,
  publishPost,
  unpublishPost,
  pinPost,
  unpinPost,
  deletePost,
  getAllPosts,
  getPostByIdOrSlug,
} from "../../controllers/post/post";
import { body, param, query } from "express-validator";
import "./postSwagger";

const router = Router();

const tagsValidator = body("tags")
  .optional()
  .isArray()
  .withMessage("Tags must be an array")
  .custom((tags) => {
    if (tags && !Array.isArray(tags)) {
      return false;
    }
    if (tags && tags.length > 0) {
      return tags.every((tag: any) => typeof tag === "string" && tag.length > 0);
    }
    return true;
  })
  .withMessage("Tags must be an array of non-empty strings");

/**
 * POST /blog/posts
 * Create a new blog post
 */
router.post(
  "/",
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Title must be between 1 and 500 characters"),
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1 })
    .withMessage("Content cannot be empty"),
  body("excerpt")
    .notEmpty()
    .withMessage("Excerpt is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Excerpt must be between 1 and 1000 characters"),
  tagsValidator,
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'"),
  createPost,
);

/**
 * PATCH /blog/posts/:idOrSlug
 * Update a blog post (admin only)
 * Note: This route requires ADMIN role, which is checked in the controller
 */
router.patch(
  "/:idOrSlug",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 500 })
    .withMessage("Title must be between 1 and 500 characters"),
  body("content")
    .optional()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ min: 1 })
    .withMessage("Content cannot be empty"),
  body("excerpt")
    .optional()
    .notEmpty()
    .withMessage("Excerpt cannot be empty")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Excerpt must be between 1 and 1000 characters"),
  tagsValidator,
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'"),
  updatePost,
);

/**
 * PATCH /blog/posts/:idOrSlug/publish
 * Publish a post
 */
router.patch(
  "/:idOrSlug/publish",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  body("publishedAt")
    .optional()
    .isISO8601()
    .withMessage("publishedAt must be a valid ISO8601 date string")
    .toDate(),
  publishPost,
);

/**
 * PATCH /blog/posts/:idOrSlug/unpublish
 * Unpublish a post
 */
router.patch(
  "/:idOrSlug/unpublish",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  unpublishPost,
);

/**
 * PATCH /blog/posts/:idOrSlug/pin
 * Pin a post
 */
router.patch(
  "/:idOrSlug/pin",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  body("pinnedUntil")
    .notEmpty()
    .withMessage("pinnedUntil is required")
    .isISO8601()
    .withMessage("pinnedUntil must be a valid ISO8601 date string")
    .toDate()
    .custom((pinnedUntil) => pinnedUntil > new Date())
    .withMessage("pinnedUntil must be in the future"),
  pinPost,
);

/**
 * PATCH /blog/posts/:idOrSlug/unpin
 * Unpin a post
 */
router.patch(
  "/:idOrSlug/unpin",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  unpinPost,
);

/**
 * DELETE /blog/posts/:idOrSlug
 * Delete a post
 */
router.delete(
  "/:idOrSlug",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  deletePost,
);

/**
 * GET /blog/posts
 * Get all posts (admin view)
 */
router.get(
  "/",
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  query("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'"),
  query("q")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Search query cannot be empty"),
  getAllPosts,
);

/**
 * GET /blog/posts/:idOrSlug
 * Get single post by ID or slug (admin view)
 */
router.get(
  "/:idOrSlug",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  getPostByIdOrSlug,
);

export default router;
