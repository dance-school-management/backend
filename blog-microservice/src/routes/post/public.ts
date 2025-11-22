import { Router } from "express";
import {
  getPublicPosts,
  getPublicPostByIdOrSlug,
} from "../../controllers/post/public";
import { param, query } from "express-validator";
import "../post/postSwagger";

const router = Router();

/**
 * GET /blog/public/posts
 * Get all published posts (public)
 */
router.get(
  "/posts",
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
  query("q")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search query cannot be empty"),
  query("tag")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Tag cannot be empty"),
  getPublicPosts,
);

/**
 * GET /blog/public/posts/:idOrSlug
 * Get single published post by ID or slug (public)
 */
router.get(
  "/posts/:idOrSlug",
  param("idOrSlug")
    .notEmpty()
    .withMessage("Post ID or slug is required"),
  getPublicPostByIdOrSlug,
);

export default router;

