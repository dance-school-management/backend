import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getCourseDetails,
  getCourses,
  publishCourse,
} from "../../../controllers/cms/courses";
import { body } from "express-validator";

const router = Router();

router.patch("/:id/publish", publishCourse);

router.post("/", getCourses);

router.post(
  "/new",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  createCourse,
);

router.put(
  "/edit",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  editCourse,
);

router.delete("/:id", deleteCourse);

router.get("/:id", getCourseDetails);

export default router;
