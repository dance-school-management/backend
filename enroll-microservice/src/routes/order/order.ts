import { Router } from "express";
import { makeClassOrder, makeCourseOrder } from "../../controllers/order";
import { body } from "express-validator";
import { UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";

const router = Router();

router.post(
  "/class",
  body("classId")
    .exists()
    .withMessage("Class ID is required")
    .custom(async (value, { req }) => {
      const studentId = req.user.id;
      const classTicket = await prisma.classTicket.findFirst({
        where: {
          classId: value,
          studentId,
        },
      });
      if (classTicket) {
        throw new UniversalError(
          StatusCodes.BAD_REQUEST,
          "You have already ordered this class",
          [],
        );
      }
      return true;
    }),
  body("classId").isNumeric().withMessage("Class ID must be a number"),

  makeClassOrder,
);

router.post(
  "/course",
  body("groupNumber")
    .exists()
    .withMessage("Group number is required")
    .isNumeric()
    .withMessage("Group number must be a number"),
  body("courseId")
    .exists()
    .withMessage("Course ID is required")
    .custom(async (value, { req }) => {
      const studentId = req.user.id;
      const classTicket = await prisma.courseTicket.findFirst({
        where: {
          courseId: value,
          studentId,
        },
      });
      if (classTicket) {
        throw new UniversalError(
          StatusCodes.BAD_REQUEST,
          "You have already ordered this course",
          [],
        );
      }
      return true;
    }),
  body("courseId").isNumeric().withMessage("Course ID must be a number"),
  makeCourseOrder,
);

export default router;
