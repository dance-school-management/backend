import { Router } from "express";
import { getAllInstructors } from "../../controllers/unprotected/unprotected";

const router = Router();

router.get("/instructors", getAllInstructors);

export default router;