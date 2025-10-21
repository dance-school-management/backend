import { NextFunction, Request, Response } from "express";
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
import { checkClass } from "../grpc/client/productCommunication/checkClass";
import { checkCourse } from "../grpc/client/productCommunication/checkCourse";
import { stripe } from "../utils/stripe";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { randomUUID } from "crypto";
import { getCoursesDetails } from "../grpc/client/productCommunication/getCoursesDetails";
import { convertDateToReadable } from "../utils/helpers";

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
      StatusCodes.UNAUTHORIZED,
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

  const idempotencyKey = `checkout-class-${studentId}-${classId}`;

  const theClass = (await getClassesDetails([classId])).classesdetailsList[0];

  const price = theClass.price;

  const startDate = new Date(theClass.startDate);
  const endDate = new Date(theClass.endDate);

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["blik", "p24", "card"],
      success_url: "http://localhost:3000/payment/success",
      line_items: [
        {
          price_data: {
            product_data: {
              name: theClass.name,
              description:
                `start date: ${convertDateToReadable(startDate)} | ` +
                `end date: ${convertDateToReadable(endDate)} | ` +
                `dance category: ${theClass.danceCategoryName ?? "not provided"} | ` +
                `advancement level: ${theClass.advancementLevelName ?? "not provided"} | ` +
                `class description: ${theClass.description}`,
            },
            unit_amount: price * 100,
            currency: "pln",
          },
          quantity: 1,
        },
      ],
    },
    { idempotencyKey },
  );

  await prisma.classTicket.create({
    data: {
      checkoutSessionId: session.id,
      classId,
      studentId,
      isConfirmed: false,
      paymentStatus: PaymentStatus.PENDING,
    },
  });

  res.status(200).json({ sessionUrl: session.url });
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
      StatusCodes.UNAUTHORIZED,
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

  const theCourse = (await getCoursesDetails([courseId])).coursesDetailsList[0];

  const idempotencyKey = `checkout-course-${studentId}-${courseId}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["blik", "p24", "card"],
      success_url: "http://localhost:3000/payment/success",
      line_items: [
        {
          price_data: {
            product_data: {
              name: theCourse.name,
              description:
                `dance category: ${theCourse.danceCategoryName ?? "not provided"} | ` +
                `advancement level: ${theCourse.advancementLevelName ?? "not provided"} | ` +
                `course description: ${theCourse.description}`,
            },
            unit_amount: Number((theCourse.price * 100).toFixed(2)),
            currency: "pln",
          },
          quantity: 1,
        },
      ],
    },
    { idempotencyKey },
  );

  try {
    await prisma.$transaction(async (tx) => {
      await tx.classTicket.createMany({
        data: classes.map((classObj) => ({
          classId: classObj.classId,
          studentId,
          isConfirmed: false,
          paymentStatus: PaymentStatus.PART_OF_COURSE,
        })),
      });
      await tx.courseTicket.create({
        data: {
          checkoutSessionId: session.id,
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

  res.status(200).json({ sessionUrl: session.url });
}

export async function getPaymentLink(
  req: Request<{}, {}, {}, { classId?: number; courseId?: number }> & {
    user?: any;
  },
  res: Response,
) {
  let userId;
  if (req.user) {
    userId = req.user.id;
    if (req.user?.role !== "STUDENT") {
      throw new UniversalError(
        StatusCodes.UNAUTHORIZED,
        `You are not authorized to access /order/payment-link as ${req.user?.role}`,
        [],
      );
    }
  } else {
    throw new UniversalError(
      StatusCodes.UNAUTHORIZED,
      "Problems with authentication",
      [],
    );
  }

  const classIdQ = req.query.classId;
  const courseIdQ = req.query.courseId;

  if (classIdQ && courseIdQ) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Specify only one of the following parameters: classId, courseId",
      [],
    );
  }

  if (classIdQ) {
    const classId = Number(classIdQ);
    const paymentData = await prisma.classTicket.findFirst({
      where: {
        classId,
        studentId: userId,
      },
    });

    if (!paymentData)
      throw new UniversalError(StatusCodes.BAD_REQUEST, "Ticket not found", []);

    const sessionId = paymentData.checkoutSessionId;

    if (!sessionId)
      throw new UniversalError(
        StatusCodes.BAD_REQUEST,
        "Checkout session id is missing",
        [],
      );

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.status(StatusCodes.OK).json({ url: session.url });
    } catch (error) {
      throw new UniversalError(
        StatusCodes.NOT_FOUND,
        "Checkout session not found",
        [],
      );
    }
  }

  if (courseIdQ) {
    const courseId = Number(courseIdQ);

    const paymentData = await prisma.courseTicket.findFirst({
      where: {
        courseId,
        studentId: userId,
      },
    });

    if (!paymentData)
      throw new UniversalError(StatusCodes.BAD_REQUEST, "Ticket not found", []);

    const sessionId = paymentData.checkoutSessionId;

    if (!sessionId)
      throw new UniversalError(
        StatusCodes.BAD_REQUEST,
        "Checkout session id is missing",
        [],
      );

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.status(StatusCodes.OK).json({ url: session.url });
    } catch (error) {
      throw new UniversalError(
        StatusCodes.NOT_FOUND,
        "Checkout session not found",
        [],
      );
    }
  }
}
