import { Router } from "express";
import {
  getAllInstructors,
  getInstructor,
} from "../../controllers/unprotected/unprotected";

const router = Router();

router.get("/public/instructors", getAllInstructors);
router.get("/public/instructors/:id", getInstructor);

export default router;
