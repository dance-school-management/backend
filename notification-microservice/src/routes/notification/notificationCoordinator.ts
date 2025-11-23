import { Router } from "express";
import {
  createNotifications,
  updateNotificationContent,
} from "../../controllers/notification/notification";
import { body, param } from "express-validator";

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

router.put(
  "/:id",
  param("id").isNumeric().withMessage("id must be a number").toInt(),
  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 5, max: 100 })
    .withMessage("title must be between 5 and 100 characters"),
  body("body")
    .optional()
    .isString()
    .withMessage("body must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("body must be between 10 and 1000 characters"),
  updateNotificationContent,
);


export default router;
