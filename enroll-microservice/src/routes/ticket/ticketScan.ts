import { Router } from "express";
import { recordStudentAttendance, scanTicket } from "../../controllers/ticketCoordinator";

const router = Router();

router.put("/", recordStudentAttendance);
router.get("/", scanTicket)

export default router;