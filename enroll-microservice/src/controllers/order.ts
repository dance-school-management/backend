import { Request, Response } from "express";
import { ClassTicket, PaymentStatus } from "../../generated/client";
import { checkValidations } from "../utils/errorHelpers";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/prisma";
import { UniversalError } from "../errors/UniversalError";
import { checkClass } from "../grpc/client/productCommunication/checkClass";
import { checkCourse } from "../grpc/client/productCommunication/checkCourse";
import { stripe } from "../utils/stripe";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { getCoursesDetails } from "../grpc/client/productCommunication/getCoursesDetails";
import { createClassCheckoutSession, createCourseCheckoutSession } from "../utils/helpers";

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

  const theClass = (await getClassesDetails([classId])).classesdetailsList[0];

  await prisma.classTicket.create({
    data: {
      classId,
      studentId,
      paymentStatus: PaymentStatus.PENDING,
    },
  });

  res.status(200).json({
    className: theClass.name,
    classDescription: theClass.description,
    classStartDate: theClass.startDate,
    classEndDate: theClass.endDate,
    classPrice: theClass.price,
    classDanceCategory: theClass.danceCategoryName,
    classAdvancementLevel: theClass.advancementLevelName,
  });
}

export async function payForClass(
  req: Request<object, object, { classId: number }> & { user?: any },
  res: Response,
) {
  const { classId } = req.body;
  const studentId = req.user?.id;

  const classTicket = await prisma.classTicket.findFirst({
    where: {
      classId,
      studentId,
    },
  });

  if (!classTicket) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You are not enrolled for this class",
      [],
    );
  }

  if (classTicket.paymentStatus === "PART_OF_COURSE") {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This class has been bought as part of a course. You should pay for the entire course if you haven't already",
      [],
    );
  }

  if (classTicket.paymentStatus === "PAID") {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You have already paid for this class",
      [],
    );
  }

  if (!classTicket.checkoutSessionId) {
    const session = await createClassCheckoutSession(classId, studentId);
    res.status(StatusCodes.OK).json({ url: session.url });
  } else {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        classTicket.checkoutSessionId,
      );

      res.status(StatusCodes.OK).json({ url: session.url });
    } catch (error) {
      const session = await createClassCheckoutSession(classId, studentId);
      res.status(StatusCodes.OK).json({ url: session.url });
    }
  }
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

  try {
    await prisma.$transaction(async (tx) => {
      await tx.classTicket.createMany({
        data: classes.map((classObj) => ({
          classId: classObj.classId,
          studentId,
          paymentStatus: PaymentStatus.PART_OF_COURSE,
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

  const courseDetails = (await getCoursesDetails([courseId])).coursesDetailsList[0]

  res.status(200).json({
    courseName: courseDetails.name,
    courseDescription: courseDetails.description,
    courseDanceCategory: courseDetails.danceCategoryName,
    courseAdvancementLevel: courseDetails.advancementLevelName,
    coursePrice: courseDetails.price
  });
}

export async function payForCourse(
  req: Request<object, object, { courseId: number }> & { user?: any },
  res: Response,
) {
  const { courseId } = req.body;
  const studentId = req.user?.id;

  const courseTicket = await prisma.courseTicket.findFirst({
    where: {
      courseId,
      studentId,
    },
  });

  if (!courseTicket) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You are not enrolled for this course",
      [],
    );
  }

  if (courseTicket.paymentStatus === "PAID") {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You have already paid for this course",
      [],
    );
  }

  if (!courseTicket.checkoutSessionId) {
    const session = await createCourseCheckoutSession(courseId, studentId);
    res.status(StatusCodes.OK).json({ url: session.url });
  } else {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        courseTicket.checkoutSessionId,
      );

      res.status(StatusCodes.OK).json({ url: session.url });
    } catch (error) {
      const session = await createCourseCheckoutSession(courseId, studentId);
      res.status(StatusCodes.OK).json({ url: session.url });
    }
  }
}
