import { Router } from "express";
import classRouter from "./class/class";
import danceCategoryRouter from "./danceCategory/danceCategory";

const router = Router();

router.use("/class", classRouter);
router.use("/dance_category", danceCategoryRouter);

export default router;
