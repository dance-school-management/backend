import { Router } from "express";
import { createClassTemplate } from "../../../controllers/cms/classTemplate";
import { body } from "express-validator";

const router = Router();

router.post(
  "/new",
  body(["name", "description"]).notEmpty(),
  createClassTemplate,
);

export default router;
