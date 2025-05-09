import { Router } from "express";
import { makeClassOrder } from "../../controllers/order";
import { body } from "express-validator";

const router = Router();

router.post('/class',
  body('classId').exists().withMessage('Class ID is required'),
  body('classId').isNumeric().withMessage('Class ID must be a number'),
  body('studentId').exists().withMessage('Student ID is required'),
  body('studentId').isNumeric().withMessage('Student ID must be a number'),
  makeClassOrder);
// router.post('/event', makeEventOrder);
// router.post('/course', makeCourseOrder);

export default router; 