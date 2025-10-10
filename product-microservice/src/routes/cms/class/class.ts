import { Router } from "express";
import {
  availableClassrooms,
  availableInstructors,
  createClass,
  editClassStatus,
  getClassDetails,
} from "../../../controllers/cms/class";
import { body, param, query } from "express-validator";

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

router.put("/status/edit", editClassStatus);

router.get("/:id", getClassDetails);

router.get(
  "/available/classrooms",
  query(["startDateQ", "endDateQ"])
    .isISO8601()
    .withMessage("startDate and endDate must be ISO8601")
    .toDate(),
  availableClassrooms,
);
router.get(
  "/available/instructors",
  query(["startDateQ", "endDateQ"])
    .isISO8601()
    .withMessage("startDate and endDate must be ISO8601")
    .toDate(),
  availableInstructors,
);

export default router;
