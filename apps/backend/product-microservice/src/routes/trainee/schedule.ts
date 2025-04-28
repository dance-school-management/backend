import { Router } from "express";
import { dailySchedule } from "../../controllers/trainee/schedule";

const router = Router();

router.post("/daily", dailySchedule)

export default router;