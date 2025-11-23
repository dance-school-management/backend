import { Router } from "express";
import { getCoursesClasses, getSchedule, getSearchAndFilterCourses } from "../../controllers/schedule";

const router = Router();

router.get("/", getSchedule);
router.get("/search/courses", getSearchAndFilterCourses);
router.get("/courses/classes", getCoursesClasses);

export default router;
