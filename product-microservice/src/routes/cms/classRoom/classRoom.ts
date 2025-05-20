import { Router } from "express";
import {
  createClassRoom,
  deleteClassRoom,
  editClassRoom,
  getAllClassRooms,
  getClassRoom,
} from "../../../controllers/cms/classRoom";
import { body } from "express-validator";

const router = Router();

router.post(
  "/",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  createClassRoom,
);

router.put(
  "/:id",
  body(["name"]).notEmpty().withMessage("Name must not be empty"),
  editClassRoom,
);

router.delete("/:id", deleteClassRoom);

router.get("/:id", getClassRoom);

router.get("/", getAllClassRooms);

export default router;
