import { Router } from "express";
import { getStudentTickets, refundTicket } from "../../controllers/ticketStudent";

const router = Router();

router.get("/", getStudentTickets);
router.post("/refund", refundTicket);

export default router;
