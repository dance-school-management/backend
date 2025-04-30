import { Router } from "express";
import {
  addCourse,
  editCourse,
  getCourses,
} from "../../../controllers/cms/courses";
import { body } from "express-validator";

const router = Router();

router.post("/", getCourses);

router.post("/new", body(["name"]).notEmpty(), addCourse);

router.put("/edit", body(["name"]).notEmpty(), editCourse);

export default router;
