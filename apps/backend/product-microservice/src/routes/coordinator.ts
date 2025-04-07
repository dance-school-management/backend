
import { Router } from "express";
import { createDanceCategory, test, testing_post } from "../controllers/coordinator";
import { body } from "express-validator";
const router = Router();

// router.post("/course");

router.post("/dance_category", createDanceCategory);

router.get("/", test);

router.post('/', body('test').isString().notEmpty(), testing_post)

export default router;
