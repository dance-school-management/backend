import { Router } from "express";
import { getStudentTickets } from "../../controllers/ticketStudent";
import { scanTicket } from "../../controllers/ticketInstructor";

const router = Router();

router.get("/", getStudentTickets);
router.post("/scan", scanTicket);

export default router;