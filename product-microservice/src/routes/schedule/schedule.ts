import { Router } from "express";
import { getSchedule } from "../../controllers/schedule";

const router = Router();

router.get("/", getSchedule);

export default router;
