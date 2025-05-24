import { Router } from "express";
import classRouter from "./class/class";
import danceCategoryRouter from "./danceCategory/danceCategory";
import courseRouter from "./courses/courses";
// import traineeSchedule from "../student/schedule";
import classTemplateRouter from "../cms/classTemplate/classTemplate";
import classRoomRouter from "../cms/classRoom/classRoom";
import advancementLevelRouter from "./advancementLevel/advancementLevel";
import aggregationsRouter from "../cms/aggregations/aggregations";

const router = Router();

router.use("/class", classRouter);
router.use("/dance_category", danceCategoryRouter);
router.use("/advancement_level", advancementLevelRouter);
router.use("/course", courseRouter);
// router.use("/trainee_schedule", traineeSchedule);
router.use("/class_template", classTemplateRouter);
router.use("/class_room", classRoomRouter);
router.use("/aggregations", aggregationsRouter);

export default router;
