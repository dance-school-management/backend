import { Router } from "express";
import { addCourse, editCourse, getCourses } from "../../controllers/cms/courses";

const router = Router();

router.post("/", getCourses);

router.post("/new", addCourse);

router.put("/edit", editCourse);

export default router;
