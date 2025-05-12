import { Router } from "express";
import {
  createAdvancementLevel,
  deleteAdvancementLevel,
  getAdvancementLevel,
  getAdvancementLevelList,
  updateAdvancementLevel,
} from "../../../controllers/cms/advancementLevel";
import { body, oneOf, param } from "express-validator";

const router = Router();

router.post(
  "/",
    body("name").exists().withMessage("Name is required"),
  body("name").isString().withMessage("Name must be a string"),
  body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
  body("name").isLength({ max: 50 }).withMessage("Name must be at most 50 characters long"),
  body("description").exists().withMessage("Description is required"),
  body("description").isString().withMessage("Description must be a string"),
  body("description").isLength({ min: 3 }).withMessage("Description must be at least 3 characters long"),
  body("description").isLength({ max: 200 }).withMessage("Description must be at most 200 characters long"),
  //body(["name", "description"]),
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
