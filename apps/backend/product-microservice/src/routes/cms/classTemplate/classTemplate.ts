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

router.post("/", body(["name"]).notEmpty(), createClassTemplate);

router.put("/:id", body(["name"]).notEmpty(), editClassTemplate);

router.delete("/:id", deleteClassTemplate);

router.get("/:id", getClassTemplate);

router.get("/", getAllClassTemplates);

export default router;
