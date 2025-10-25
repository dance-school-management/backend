import { Router } from "express";
import { postponeClass } from "../../../controllers/cms/cancelOrPostpone";
import { body } from "express-validator";

const router = Router();

router.post(
  "/class",
  body(["newStartDate", "newEndDate"])
    .isISO8601()
    .withMessage("Dates must be of type ISO8601")
    .toDate(),
  postponeClass,
);

export default router;
