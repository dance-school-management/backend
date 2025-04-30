import { Router } from "express";
import { createClassRoom } from "../../../controllers/cms/classRoom";
import { body } from "express-validator";

const router = Router();

router.post("/new", body(["name"]).notEmpty(), createClassRoom);

export default router;
