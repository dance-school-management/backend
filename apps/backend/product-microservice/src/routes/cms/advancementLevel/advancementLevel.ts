import { Router } from "express";
import {
  createAdvancementLevel,
  getAdvancementLevel,
  getAdvancementLevelList,
} from "../../../controllers/cms/advancementLevel";
import { body } from "express-validator";

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
export default router;
