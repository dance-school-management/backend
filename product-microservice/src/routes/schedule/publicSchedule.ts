import { Router } from "express";
import { getClassDetails, getCoursesClasses, getSchedule, getSearchAndFilterCourses } from "../../controllers/schedule";

const router = Router();

router.get("/", getSchedule);
router.get("/search/courses", getSearchAndFilterCourses);
router.get("/courses/classes", getCoursesClasses);
router.get("/class/:id", getClassDetails);

export default router;
