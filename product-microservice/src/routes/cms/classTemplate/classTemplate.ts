import { Router } from "express";
import {
  createClassTemplate,
  deleteClassTemplate,
  editClassTemplate,
  getAllClassTemplates,
  getClassTemplate,
} from "../../../controllers/cms/classTemplate";
import { body } from "express-validator";

const router = Router();

router.post(
  "/",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  createClassTemplate,
);

router.put(
  "/:id",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  editClassTemplate,
);

router.delete("/:id", deleteClassTemplate);

router.get("/:id", getClassTemplate);

router.get("/", getAllClassTemplates);

export default router;
