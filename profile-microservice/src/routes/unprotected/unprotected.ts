import { Router } from "express";
import {
  getAllInstructors,
  getInstructor,
} from "../../controllers/unprotected/unprotected";

const router = Router();

router.get("/instructors", getAllInstructors);
router.get("/instructors/:id", getInstructor);

export default router;
