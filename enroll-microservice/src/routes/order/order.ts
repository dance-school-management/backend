import { Router } from "express";
import { makeClassOrder, makeCourseOrder } from "../../controllers/order";
import { body } from "express-validator";

const router = Router();

router.post(
  "/class",
  body("classId").exists().withMessage("Class ID is required"),
  body("classId").isNumeric().withMessage("Class ID must be a number"),
  makeClassOrder,
);

router.post(
  "/course",
  body("courseId").exists().withMessage("Course ID is required"),
  body("courseId").isNumeric().withMessage("Course ID must be a number"),
  makeCourseOrder,
);

export default router;
