import { Router } from "express";
import { getSchedulePersonal } from "../../controllers/schedule";

const router = Router();

router.get("/personal", getSchedulePersonal);

export default router;
