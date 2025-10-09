import { Router } from "express";
import { getCoursesClasses, getSchedule, getSchedulePersonal, getSearchAndFilterCourses } from "../../controllers/schedule";

const router = Router();

router.get("/", getSchedule);
router.get("/personal", getSchedulePersonal);
router.get("/search/courses", getSearchAndFilterCourses)
router.get("/courses/classes", getCoursesClasses)

export default router;
