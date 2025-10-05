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

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      success_url: "https://www.youtube.com/watch?v=0VE0zjlbD60",
      cancel_url: "https://www.youtube.com/watch?v=t8lnCA8PHJM",
      line_items: [
        {
          price_data: {
            product_data: {
              name: theClass.name,
              description: theClass.description,
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
      qrCodeUUID: randomUUID()
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
      success_url: "https://www.youtube.com/watch?v=0VE0zjlbD60",
      cancel_url: "https://www.youtube.com/watch?v=t8lnCA8PHJM",
      line_items: [
        {
          price_data: {
            product_data: {
              name: theCourse.name,
              description: theCourse.description,
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
          qrCodeUUID: randomUUID()
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

  res.status(200).json({ sessionUrl: session.url })
}
