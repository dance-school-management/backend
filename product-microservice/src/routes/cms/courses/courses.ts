import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  editCourse,
  getCourseDetails,
  getCourses,
} from "../../../controllers/cms/courses";
import { body } from "express-validator";

const router = Router();

router.post("/", getCourses);

router.post(
  "/new",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  addCourse,
);

router.put(
  "/edit",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  editCourse,
);

router.delete("/:id", deleteCourse);

router.get("/:id", getCourseDetails);

export default router;
