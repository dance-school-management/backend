import { Router } from "express";
import { createClass } from "../../../controllers/cms/class";

const router = Router();

router.post("/new", createClass)

export default router;
