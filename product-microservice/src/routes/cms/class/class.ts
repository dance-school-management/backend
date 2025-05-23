import { Router } from "express";
import {
  createClass,
  editClassStatus,
  getClassDetails,
  getSchedule,
} from "../../../controllers/cms/class";
import { body, param } from "express-validator";

const router = Router();

router.post(
  "/",
  body("instructorIds")
    .isArray({ min: 1 })
    .withMessage("instructorIds must be a non-empty array")
    .bail()
    .custom((arr) => arr.every((id: any) => typeof id === "string"))
    .withMessage("All instructorIds must be strings"),
  body(["startDate", "endDate"])
    .isISO8601()
    .withMessage("Dates must be of type ISO8601")
    .toDate(),

  createClass,
);

router.get(
  "/:startDateFrom/:startDateTo",
  param(["startDateFrom", "startDateTo"])
    .isISO8601()
    .withMessage("Dates must be of type ISO8601")
    .toDate(),
  getSchedule,
);

router.put("/status/edit", editClassStatus);

router.get("/:id", getClassDetails);

export default router;
