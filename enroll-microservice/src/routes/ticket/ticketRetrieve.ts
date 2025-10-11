import { Router } from "express";
import { getStudentTickets } from "../../controllers/ticketStudent";
import { recordStudentAttendance, scanTicket } from "../../controllers/ticketCoordinator";

const router = Router();

router.get("/", getStudentTickets);


export default router;
