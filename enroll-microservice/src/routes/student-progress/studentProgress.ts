import { Router } from "express";
import {
  getCoursesAttendanceProgress,
  getHoursSpentDanceCategories,
  getHoursSpentInstructors,
  getLearntDanceCategories,
} from "../../controllers/student-progress/studentProgress";

const router = Router();

router.get("/learnt-dance-categories", getLearntDanceCategories);
router.get("/courses-attendance-rates", getCoursesAttendanceProgress);
router.get("/hours-spent/dance-categories", getHoursSpentDanceCategories);
router.get("/hours-spent/instructors", getHoursSpentInstructors);

export default router;
