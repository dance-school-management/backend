import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  updateNotificationStatus,
  createNotifications,
  updateNotificationContent,
  toggleEnableNotifications,
  getIsRegisteredForNotifications,
  updateNotificationsStatus,
} from "../../controllers/notification/notification";
import { body, query, param } from "express-validator";
import {
  register,
  unregisterFromPushNotifications,
} from "../../controllers/notification/register";

const router = Router();

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

router.get("/status", getIsRegisteredForNotifications);

router.get(
  "/:id",
  param("id").isNumeric().withMessage("id must be a number").toInt(),
  getNotificationById,
);

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
  "/status/many",
  body("ids").isArray().withMessage("ids must be an array of numbers"),
  body("hasBeenRead").isBoolean().withMessage("hasBeenRead must be a boolean"),
  updateNotificationsStatus,
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
  body("body")
    .optional()
    .isString()
    .withMessage("body must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("body must be between 10 and 1000 characters"),
  updateNotificationContent,
);

// router.delete(
//   "/:id",
//   param("id").isNumeric().withMessage("id must be a number").toInt(),
//   deleteNotification,
// );

router.post("/register", register);
router.post("/toggle", toggleEnableNotifications);
router.put("/push/unregister", unregisterFromPushNotifications);

export default router;
