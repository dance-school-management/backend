import { Router } from "express";
import classRouter from "./class/class";
import danceCategoryRouter from "./danceCategory/danceCategory";
import courseRouter from "./courses/courses";
import traineeSchedule from "../trainee/schedule";
import advancementLevelRouter from "./advancementLevel/advancementLevel";

const router = Router();

router.use("/class", classRouter);
router.use("/dance_category", danceCategoryRouter);
router.use("/advancement_level", advancementLevelRouter);
router.use("/course", courseRouter);
router.use("/trainee_schedule", traineeSchedule);

export default router;
