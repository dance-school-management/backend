import { Router } from "express";
import { getMostPopularCourses } from "../../controllers/pricing/pricing";
import { query } from "express-validator";

const router = Router();

router.get(
  "/most_popular_courses",
  query(["startDateFrom", "startDateTo"])
    .isISO8601()
    .withMessage("Dates must be of type ISO8601"),
  getMostPopularCourses,
);

export default router;
