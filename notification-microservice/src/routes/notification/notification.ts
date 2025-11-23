import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
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

router.put(
  "/status",
  body("ids").isArray().withMessage("ids must be an array of numbers"),
  body("hasBeenRead").isBoolean().withMessage("hasBeenRead must be a boolean"),
  updateNotificationsStatus,
);

router.post("/register", register);
router.post("/toggle", toggleEnableNotifications);
router.put("/push/unregister", unregisterFromPushNotifications);

export default router;
