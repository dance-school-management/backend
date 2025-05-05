import { Router } from "express";
import {
  createDanceCategory,
  deleteDanceCategory,
  getDanceCategory,
  getDanceCategoryList,
  updateDanceCategory,
} from "../../../controllers/cms/danceCategory";
import upload from "../../..//utils/multer";
import { body, param } from "express-validator";

const router = Router();

router.post(
  "/",
  upload.single("photo"),
  body(["name", "description"]).notEmpty(),
  createDanceCategory,
);
router.get("/:id", getDanceCategory);
router.get("/", getDanceCategoryList);
router.delete("/:id", deleteDanceCategory);
router.put(
  "/:id",
  upload.single("photo"),
  param("id").isNumeric(),
  body(["name", "description"]).notEmpty(),
  updateDanceCategory,
);

export default router;
