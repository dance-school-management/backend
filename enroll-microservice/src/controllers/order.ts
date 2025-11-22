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
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { stripe } from "../utils/stripe";
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

  const classDetails = (await getClassesDetails([classId]))
    .classesdetailsList[0];

  const currentClassTicketsCount = await prisma.classTicket.aggregate({
    where: {
      classId,
      paymentStatus: {
        in: [
          PaymentStatus.PAID,
          PaymentStatus.PENDING,
          PaymentStatus.PART_OF_COURSE,
        ],
      },
    },
    _count: {
      studentId: true,
    },
  });

  const classTicketsCount = currentClassTicketsCount._count.studentId;

  const existingReservation = await prisma.classTicket.findFirst({
    where: {
      classId,
      studentId,
    },
  });

  if (!existingReservation && classTicketsCount >= classLimit) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      `This class with id ${classId} is already full`,
      [],
    );
  }

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

  if (!existingReservation) {
    const expiresAt = new Date(new Date().getTime() + 35 * 1000 * 60);

    await prisma.$transaction(async (tx) => {
      const { session, classData } = await createClassCheckoutSession(
        classId,
        studentId,
      );
      await tx.classTicket.create({
        data: {
          classId,
          studentId,
          paymentStatus: PaymentStatus.PENDING,
          checkoutSessionId: session.id,
        },
      });

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
      return;
    });
  } else {
    try {
      if (!existingReservation.checkoutSessionId) {
        throw new UniversalError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Problem with retrieving checkout session. Checkout session not saved in database.",
          [],
        );
      }

      const session = await stripe.checkout.sessions.retrieve(
        existingReservation.checkoutSessionId,
      );

      res.status(StatusCodes.OK).json({
        sessionUrl: session.url,
        className: classDetails.name,
        classDescription: classDetails.description,
        classStartDate: classDetails.startDate,
        classEndDate: classDetails.endDate,
        classPrice: classDetails.price,
        classDanceCategory: classDetails.danceCategoryName,
        classAdvancementLevel: classDetails.advancementLevelName,
      });
      return;
    } catch (error) {
      throw new UniversalError(
        StatusCodes.BAD_REQUEST,
        "Checkout session not found.",
        [],
      );
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

  const minPeopleLimit = classes.reduce((acc, cur) =>
    cur.peopleLimit < acc.peopleLimit ? cur : acc,
  ).peopleLimit;

  const currentCourseTickets = await prisma.courseTicket.aggregate({
    where: {
      courseId,
      paymentStatus: {
        in: [PaymentStatus.PAID, PaymentStatus.PENDING],
      },
    },
    _count: {
      studentId: true,
    },
  });

  const existingReservation = await prisma.courseTicket.findFirst({
    where: {
      courseId,
      studentId,
    },
  });

  if (
    !existingReservation &&
    currentCourseTickets._count.studentId >= minPeopleLimit
  ) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Maximum number of course participants has been reached",
      [],
    );
  }

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

  if (!existingReservation) {
    await prisma.$transaction(async (tx) => {
      const { session, courseData } = await createCourseCheckoutSession(
        courseId,
        studentId,
        groupNumber,
      );
      await tx.courseTicket.create({
        data: {
          courseId,
          studentId,
          paymentStatus: PaymentStatus.PENDING,
          checkoutSessionId: session.id,
        },
      });

      await tx.classTicket.createMany({
        data: classes.map((classObj) => ({
          classId: classObj.classId,
          studentId,
          paymentStatus: PaymentStatus.PART_OF_COURSE,
        })),
      });

      res.status(StatusCodes.OK).json({
        sessionUrl: session.url,
        courseName: courseData.name,
        courseDescription: courseData.description,
        coursePrice: courseData.price,
        courseDanceCategory: courseData.danceCategoryName,
        courseAdvancementLevel: courseData.advancementLevelName,
      });
      return;
    });
  } else {
    try {
      if (!existingReservation.checkoutSessionId) {
        throw new UniversalError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Problem with retrieving checkout session. Checkout session not saved in database.",
          [],
        );
      }

      const session = await stripe.checkout.sessions.retrieve(
        existingReservation.checkoutSessionId,
      );

      const courseDetails = (await getCoursesDetails([courseId]))
        .coursesDetailsList[0];

      res.status(StatusCodes.OK).json({
        sessionUrl: session.url,
        courseName: courseDetails.name,
        courseDescription: courseDetails.description,
        coursePrice: courseDetails.price,
        courseDanceCategory: courseDetails.danceCategoryName,
        courseAdvancementLevel: courseDetails.advancementLevelName,
      });
      return;
    } catch (error) {
      throw new UniversalError(
        StatusCodes.BAD_REQUEST,
        "Checkout session not found.",
        [],
      );
    }
  }
}

export async function payForPrivateClass(
  req: Request<object, object, { classId: number }> & {
    user?: any;
  },
  res: Response,
) {
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

  const classDetails = (await getClassesDetails([classId]))
    .classesdetailsList[0];

  if (classDetails.classType !== "PRIVATE_CLASS") {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The class you are trying to pay for is not private",
      [],
    );
  }

  const enrollment = await prisma.classTicket.findUnique({
    where: {
      studentId_classId: {
        studentId,
        classId,
      },
    },
  });

  if (!enrollment) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You are not enrolled for this class or your enrollment has expired",
      [],
    );
  }

  if (enrollment.paymentStatus === PaymentStatus.PAID) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You have already paid for this class",
      [],
    );
  }

  if (enrollment.paymentStatus === PaymentStatus.PART_OF_COURSE) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Error. Our system says this class is part of course, while it's private.",
      [],
    );
  }

  if (enrollment.paymentStatus === PaymentStatus.REFUNDED) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The class was refunded. You can't pay for a class after refund.",
      [],
    );
  }

  if (!enrollment.checkoutSessionId) {
    const { session, classData } = await createClassCheckoutSession(
      classId,
      studentId,
    );

    await prisma.classTicket.update({
      where: {
        studentId_classId: {
          classId,
          studentId,
        },
      },
      data: {
        checkoutSessionId: session.id,
      },
    });

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
  } else {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        enrollment.checkoutSessionId,
      );

      res.status(StatusCodes.OK).json({
        sessionUrl: session.url,
        className: classDetails.name,
        classDescription: classDetails.description,
        classStartDate: classDetails.startDate,
        classEndDate: classDetails.endDate,
        classPrice: classDetails.price,
        classDanceCategory: classDetails.danceCategoryName,
        classAdvancementLevel: classDetails.advancementLevelName,
      });
    } catch (error) {
      const { session, classData } = await createClassCheckoutSession(
        classId,
        studentId,
      );

      await prisma.classTicket.update({
        where: {
          studentId_classId: {
            classId,
            studentId,
          },
        },
        data: {
          checkoutSessionId: session.id,
        },
      });

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
    }
  }
}
