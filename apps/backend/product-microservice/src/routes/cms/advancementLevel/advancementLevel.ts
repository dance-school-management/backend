import { Router } from "express";
import {
  createAdvancementLevel,
  deleteAdvancementLevel,
  getAdvancementLevel,
  getAdvancementLevelList,
  updateAdvancementLevel,
} from "../../../controllers/cms/advancementLevel";
import { body, param } from "express-validator";

const router = Router();

router.post(
  "/",
  body(["name", "description"]).notEmpty(),
  createAdvancementLevel,
);

router.get(
  "/:id",
  body(["name", "description"]).notEmpty(),
  getAdvancementLevel,
);

router.get("/", getAdvancementLevelList);

router.delete("/:id", deleteAdvancementLevel);
router.put(
  "/:id",
  param("id").isNumeric(),
  body(["name", "description"]).notEmpty(),
  updateAdvancementLevel,
);
export default router;
