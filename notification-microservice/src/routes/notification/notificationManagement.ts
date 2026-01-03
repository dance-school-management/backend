import { Router } from "express";
import {
  createNotifications,
  getNotificationById,
  getNotifications,
} from "../../controllers/notification/notification";
import { body, param, query } from "express-validator";

const router = Router();

router.post(
  "/",
  body("userIds").isArray().withMessage("userId must be an array of strings"),
  body("title")
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 5, max: 100 })
    .withMessage("title must be between 5 and 100 characters"),
  body("body")
    .isString()
    .withMessage("description must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("description must be between 10 and 1000 characters"),
  createNotifications,
);

router.get(
  "/:id",
  param("id").isNumeric().withMessage("id must be a number").toInt(),
  getNotificationById,
);

router.get(
  "/",
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("sendDate must be a valid ISO8601 date"),
  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("sendDate must be a valid ISO8601 date"),
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
  getNotifications,
);

export default router;
