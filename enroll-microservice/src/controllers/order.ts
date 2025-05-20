import { NextFunction, Request, Response } from "express";
import { checkClass, checkCourse } from "../grpc/order/order";
import {
  ClassTicket,
  CourseTicket,
  PaymentStatus,
} from "../../generated/client";
import { checkValidations } from "../utils/errorHelpers";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/prisma";
import { UniversalError } from "../errors/UniversalError";

export async function makeClassOrder(
  req: Request<object, object, ClassTicket> & { user?: any },
  res: Response,
) {
  checkValidations(validationResult(req));
  const { classId } = req.body;
  let studentId;
  if (req.user) {
    studentId = req.user.id;
  } else {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problems with authentication",
      [],
    );
  }
  //check class existance and type and asks for the peopleLimit
  const response = await checkClass(classId);
  const classLimit = response.peopleLimit;
  const classCount = await prisma.classTicket.aggregate({
    where: {
      classId,
    },
    _count: {
      studentId: true,
    },
  });

  if (classCount._count.studentId >= classLimit) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      `This class with id ${classId} is already full`,
      [],
    );
  }
  //TODO: connection with payment-microservice to create a transaction
  await prisma.classTicket.create({
    data: {
      classId,
      studentId,
      isConfirmed: false,
      paymentStatus: PaymentStatus.PENDING,
    },
  });
  res
    .status(StatusCodes.OK)
    .json({ message: `Order for class with ${classId} created successfully` });
}
export async function makeCourseOrder(
  req: Request<object, object, { courseId: number; groupNumber: number }> & {
    user?: any;
  },
  res: Response,
) {
  checkValidations(validationResult(req));
  const { courseId, groupNumber } = req.body;
  let studentId;
  if (req.user) {
    studentId = req.user.id;
  } else {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problems with authentication",
      [],
    );
  }
  const response = await checkCourse(courseId, groupNumber); // asks the product-microservice if the course is available, asks for the maximum peopoleLimit in the course's classes
  const classes = response.peopleLimitsList;
  const currentTickets = await prisma.classTicket.groupBy({
    where: {
      classId: {
        in: classes.map((classObj) => classObj.classId),
      },
    },
    by: "classId",
    _count: {
      studentId: true,
    },
  });
  currentTickets.forEach((currentTicket) => {
    const classLimit = classes.find(
      (classObj) => classObj.classId === currentTicket.classId,
    )?.peopleLimit;
    if (classLimit && currentTicket._count.studentId >= classLimit) {
      throw new UniversalError(
        StatusCodes.BAD_REQUEST,
        `This class with id ${currentTicket.classId} is already full, you can't enroll in this course`,
        [],
      );
    }
  });
  try {
    prisma.$transaction(async (tx) => {
      await tx.classTicket.createMany({
        data: classes.map((classObj) => ({
          classId: classObj.classId,
          studentId,
          isConfirmed: false,
          paymentStatus: PaymentStatus.PENDING,
        })),
      });
      await tx.courseTicket.create({
        data: {
          courseId,
          studentId,
          paymentStatus: PaymentStatus.PENDING,
        },
      });
    });
  } catch (err: any) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create course order",
      [],
    );
  }

  // asks the payment-microservice for starting transaction and the result
  res.status(StatusCodes.OK).json({ message: "Order created successfully" });
}
