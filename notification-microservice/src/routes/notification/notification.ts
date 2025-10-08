import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotificationStatus,
  updateNotificationContent,
  deleteNotification,
} from "../../controllers/notification/notification";
import { body, query, param } from "express-validator";
import { registerDevice } from "../../controllers/notification/registerDevice";

const router = Router();

router.get(
  "/",
  query("productId")
    .optional()
    .isNumeric()
    .withMessage("productId must be a number")
    .toInt(),
  query("productType")
    .optional()
    .isString()
    .withMessage("productType must be a string")
    .isIn(["COURSE", "CLASS", "EVENT"])
    .withMessage(
      "productType must be one of the following: COURSE, CLASS, EVENT",
    ),
  query("userId")
    .optional()
    .isNumeric()
    .withMessage("userId must be a number")
    .toInt(),
  query("sendDate")
    .optional()
    .isISO8601()
    .withMessage("sendDate must be a valid ISO8601 date"),
  query("hasBeenRead")
    .optional()
    .isBoolean()
    .withMessage("hasBeenRead must be a boolean"),
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

router.get(
  "/:id",
  param("id").isNumeric().withMessage("id must be a number").toInt(),
  getNotificationById,
);

router.post(
  "/",
  body("productId")
    .isNumeric()
    .withMessage("productId must be a number")
    .toInt(),
  body("productType")
    .isString()
    .withMessage("productType must be a string")
    .isIn(["COURSE", "CLASS", "EVENT"])
    .withMessage(
      "productType must be one of the following: COURSE, CLASS, EVENT",
    ),
  body("userId").isNumeric().withMessage("userId must be a number").toInt(),
  body("title")
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 5, max: 100 })
    .withMessage("title must be between 5 and 100 characters"),
  body("description")
    .isString()
    .withMessage("description must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("description must be between 10 and 1000 characters"),
  createNotification,
);

router.put(
  "/status/:id",
  param("id").isNumeric().withMessage("id must be a number").toInt(),
  body("hasBeenRead").isBoolean().withMessage("hasBeenRead must be a boolean"),
  updateNotificationStatus,
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
  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("description must be between 10 and 1000 characters"),
  updateNotificationContent,
);

router.delete(
  "/:id",
  param("id").isNumeric().withMessage("id must be a number").toInt(),
  deleteNotification,
);

router.post("/register", registerDevice)

export default router;
