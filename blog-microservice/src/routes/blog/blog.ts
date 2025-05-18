import { Router } from "express";
import {
    getBlogEntries,
    getBlogEntryById,
    createBlogEntry,
    updateBlogEntry,
    deleteBlogEntry
} from "../../controllers/blog";
import { body, query, param } from "express-validator";

interface BlogData {
    content: string;
    photos?: string[];
    tags?: string[];
    authors?: string[];
}

const router = Router();

router.get(
    "/",
    query("title")
        .optional()
        .isString()
        .withMessage("title must be a string"),
    query("createdAt")
        .optional()
        .isISO8601()
        .withMessage("createdAt must be a valid ISO8601 date"),
    query("tags")
        .optional()
        .custom((value) => {
            if (typeof value === "string") {
                return true;
            }
            if (!value.every((item: string) => typeof item === "string")) {
                throw new Error("tags must be an array of strings");
            }
            return true;
        })
        .withMessage("tags must be an array of strings"),
    query("authors")
        .optional()
        .custom((value) => {
            if (typeof value === "string") {
                return true;
            }
            if (!value.every((item: string) => typeof item === "string")) {
                throw new Error("authors must be an array of strings");
            }
            return true;
        })
        .withMessage("authors must be an array of strings"),
    query("page")
        .optional()
        .isNumeric()
        .withMessage("page must be a number")
        .toInt(),
    query("limit")
        .optional()
        .isNumeric()
        .withMessage("limit must be a number")
        .toInt(),
    getBlogEntries
)

router.get(
    "/:id",
    param("id")
        .isNumeric()
        .withMessage("id must be a number")
        .toInt(),
    getBlogEntryById
)

router.post(
    "/",
    body("title")
        .isString()
        .withMessage("title must be a string")
        .isLength({ min: 1 })
        .withMessage("title must be at least 1 character long"),
    body("data")
        .custom((value) => {
            if (!isBlogData(value)) {
                throw new Error("data must be a valid JSON");
            }
            return true;
        })
        .withMessage("data must be a valid JSON"),
    createBlogEntry
)

router.put(
    "/:id",
    param("id")
        .isNumeric()
        .withMessage("id must be a number")
        .toInt(),
    body("title")
        .optional()
        .isString()
        .withMessage("title must be a string")
        .isLength({ min: 1 })
        .withMessage("title must be at least 1 character long"),
    body("data")
        .optional()
        .custom((value) => {
            if (!isBlogData(value)) {
                throw new Error("data must be a valid JSON");
            }
            return true;
        })
        .withMessage("data must be a valid JSON"),
    updateBlogEntry
)

router.delete(
    "/:id",
    param("id")
        .isNumeric()
        .withMessage("id must be a number")
        .toInt(),
    deleteBlogEntry
)

function isBlogData(data: BlogData): boolean {
    if (typeof data !== "object" || data === null) {
        return false;
    }
    if (typeof data.content !== "string") {
        return false;
    }
    if (data.photos && !Array.isArray(data.photos)) {
        return false;
    }
    if (data.authors && !Array.isArray(data.authors)) {
        return false;
    }
    if (data.tags && !Array.isArray(data.tags)) {
        return false;
    }
    return true;
}

export default router;