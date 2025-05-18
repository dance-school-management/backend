import { Router } from "express";
import {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
} from "../../controllers/review";
import { body, query, param } from "express-validator";

const router = Router();

router.get(
    "/",
    query("authorId")
        .optional()
        .isInt()
        .withMessage("authorId must be an integer"),
    query("courseTemplateId")
        .optional()
        .isInt()
        .withMessage("courseTemplateId must be an integer"),
    query("stars")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("stars must be a float between 0 and 5"),
    query("username")
        .optional()
        .isString()
        .withMessage("username must be a string"),
    query("createdAt")
        .optional()
        .isISO8601()
        .withMessage("createdAt must be a valid ISO8601 date"),
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
    getReviews
)

router.get(
    "/:id",
    param("id")
        .isInt()
        .withMessage("id must be an integer"),
    getReviewById
)

router.post(
    "/",
    body("authorId")
        .isInt()
        .withMessage("authorId must be an integer"),
    body("courseTemplateId")
        .isInt()
        .withMessage("courseTemplateId must be an integer"),
    body("text")
        .isString()
        .withMessage("text must be a string"),
    body("stars")
        .isFloat({ min: 0, max: 5 })
        .withMessage("stars must be a float between 0 and 5"),
    body("author")
        .isObject()
        .withMessage("author must be an object"),
    body("author.username")
        .isString()
        .withMessage("author.username must be a string"),
    body("author.photoUrl")
        .isString()
        .withMessage("author.photoUrl must be a string"),
    createReview
)

router.put(
    "/:id",
    param("id")
        .isInt()
        .withMessage("id must be an integer"),
    body("text")
        .optional()
        .isString()
        .withMessage("text must be a string"),
    body("stars")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("stars must be a float between 0 and 5"),
    updateReview
)

router.delete(
    "/:id",
    param("id")
        .isInt()
        .withMessage("id must be an integer"),
    deleteReview
)

export default router;