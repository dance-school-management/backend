import { Router } from "express";
import { getSchedule, getSchedulePersonal } from "../../controllers/schedule";

const router = Router();

router.get("/", getSchedule);
router.get("/personal", getSchedulePersonal);

export default router;
