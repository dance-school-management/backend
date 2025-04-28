import { Router } from "express";
import { createClassTemplate } from "../../../controllers/cms/classTemplate";

const router = Router();

router.post("/new", createClassTemplate)

export default router;