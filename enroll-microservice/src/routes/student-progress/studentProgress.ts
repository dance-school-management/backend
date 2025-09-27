import { Router } from "express";
import {
  coursesAttendanceProgress,
  hoursSpentDanceCategories,
  hoursSpentInstructors,
  learntDanceCategories,
} from "../../controllers/student-progress/studentProgress";

const router = Router();

router.get("/learnt-dance-categories", learntDanceCategories);
router.get("/courses-attendance-rates", coursesAttendanceProgress);
router.get("/hours-spent/dance-categories", hoursSpentDanceCategories);
router.get("/hours-spent/instructors", hoursSpentInstructors);

export default router;
