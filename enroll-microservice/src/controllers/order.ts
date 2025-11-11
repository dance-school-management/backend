import { Request, Response } from "express";
import { ClassTicket } from "../../generated/client";
import { checkValidations } from "../utils/errorHelpers";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/prisma";
import { UniversalError } from "../errors/UniversalError";
import { checkClass } from "../grpc/client/productCommunication/checkClass";
import { checkCourse } from "../grpc/client/productCommunication/checkCourse";
import {
  createClassCheckoutSession,
  createCourseCheckoutSession,
} from "../utils/helpers";
import { PaymentStatus } from "../../generated/client";

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

  const existingReservation = await prisma.classTicket.findFirst({
    where: {
      classId,
      studentId,
    },
  });

  if (existingReservation?.paymentStatus === PaymentStatus.PAID) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class ticket already paid",
      [],
    );
  }

  if (existingReservation?.paymentStatus === PaymentStatus.REFUNDED) {
    throw new UniversalError(StatusCodes.CONFLICT, "Class ticket refunded", []);
  }

  if (existingReservation?.paymentStatus === PaymentStatus.PART_OF_COURSE) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Class is bought as part of course. You need to pay for the entire course.",
      [],
    );
  }

  if (
    existingReservation?.expiresAt &&
    existingReservation?.expiresAt < new Date()
  ) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Checkout session has expired. Try again later.",
      [],
    );
  }

  if (!existingReservation) {
    const expiresAt = new Date(new Date().getTime() + 35 * 1000 * 60);

    await prisma.$transaction(async (tx) => {
      await tx.classTicket.create({
        data: {
          classId,
          studentId,
          paymentStatus: PaymentStatus.PENDING,
          expiresAt,
        },
      });

      const { session, classData } = await createClassCheckoutSession(
        classId,
        studentId,
      );

      res.status(StatusCodes.OK).json({
        sessionUrl: session.url,
        className: classData.name,
        classDescription: classData.description,
        classStartDate: classData.startDate,
        classEndDate: classData.endDate,
        classPrice: classData.price,
        classDanceCategory: classData.danceCategoryName,
        classAdvancementLevel: classData.advancementLevelName,
      });
    });
  }

  res.status(StatusCodes.BAD_REQUEST);
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

  const existingReservation = await prisma.courseTicket.findFirst({
    where: {
      courseId,
      studentId,
    },
  });

  if (existingReservation?.paymentStatus === PaymentStatus.PAID) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Course ticket already paid",
      [],
    );
  }

  if (existingReservation?.paymentStatus === PaymentStatus.REFUNDED) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Course ticket refunded",
      [],
    );
  }

  if (
    existingReservation?.expiresAt &&
    existingReservation?.expiresAt < new Date()
  ) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Checkout session has expired. Try again later.",
      [],
    );
  }

  if (!existingReservation) {
    const expiresAt = new Date(new Date().getTime() + 35 * 1000 * 60);

    await prisma.$transaction(async (tx) => {
      await tx.courseTicket.create({
        data: {
          courseId,
          studentId,
          paymentStatus: PaymentStatus.PENDING,
          expiresAt,
        },
      });

      await tx.classTicket.createMany({
        data: classes.map((classObj) => ({
          classId: classObj.classId,
          studentId,
          paymentStatus: PaymentStatus.PART_OF_COURSE,
        })),
      });

      const { session, courseData } = await createCourseCheckoutSession(
        courseId,
        studentId,
        groupNumber,
      );

      res.status(StatusCodes.OK).json({
        sessionUrl: session.url,
        courseName: courseData.name,
        courseDescription: courseData.description,
        coursePrice: courseData.price,
        courseDanceCategory: courseData.danceCategoryName,
        courseAdvancementLevel: courseData.advancementLevelName,
      });
    });
  }

  res.status(StatusCodes.BAD_REQUEST);
}
