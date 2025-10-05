import { Router } from "express";
import { getMostPopularCourses } from "../../controllers/pricing/pricing";

const router = Router();

router.get("/most-popular-courses", getMostPopularCourses);

export default router;