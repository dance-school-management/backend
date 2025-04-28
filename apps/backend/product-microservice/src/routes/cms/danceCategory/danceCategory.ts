import { Router } from "express";
import {
  createDanceCategory,
  getDanceCategory,
  getDanceCategoryList,
} from "../../../controllers/cms/danceCategory";
import upload from "../../..//utils/multer";
import { body } from "express-validator";

const router = Router();

router.post(
  "/",
  upload.single("photo"),
  body(["name", "description"]).notEmpty(),
  createDanceCategory,
);

router.get("/:id", body(["name", "description"]).notEmpty(), getDanceCategory);

router.get("/", getDanceCategoryList);
export default router;
