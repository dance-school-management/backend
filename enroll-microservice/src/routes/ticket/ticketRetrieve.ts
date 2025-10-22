import { Router } from "express";
import { getStudentCourseTickets, getStudentTickets } from "../../controllers/ticketStudent";

const router = Router();

router.get("/", getStudentTickets);
router.get("/courses", getStudentCourseTickets)


export default router;
