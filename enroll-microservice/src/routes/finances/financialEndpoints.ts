import { Router } from "express";
import {
  adminMetricsCoursesTop,
  adminMetricsRevenue,
} from "../../controllers/finances/financialEndpoints";

const router = Router();

router.get("/metrics/revenue", adminMetricsRevenue);
router.get("/metrics/courses/top", adminMetricsCoursesTop);

export default router;
