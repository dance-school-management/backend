import { Router } from "express";
import { getAllAdvancementLevelsAndDanceCategoriesAndClassrooms } from "../../../controllers/cms/aggregations";

const router = Router();

router.get(
  "/class-template-creation-data",
  getAllAdvancementLevelsAndDanceCategoriesAndClassrooms,
);

export default router;
