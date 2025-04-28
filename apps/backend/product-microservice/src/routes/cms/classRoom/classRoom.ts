import { Router } from "express";
import { createClassRoom } from "../../../controllers/cms/classRoom";

const router = Router();

router.post("/new", createClassRoom);

export default router;
