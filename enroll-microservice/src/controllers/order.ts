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

  const { session, classData } = await createClassCheckoutSession(
    classId,
    studentId,
  );

  res.status(200).json({
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

  const { session, courseData } = await createCourseCheckoutSession(
    courseId,
    studentId,
    groupNumber,
  );

  res.status(200).json({
    sessionUrl: session.url,
    courseName: courseData.name,
    courseDescription: courseData.description,
    courseDanceCategory: courseData.danceCategoryName,
    courseAdvancementLevel: courseData.advancementLevelName,
    coursePrice: courseData.price,
  });
}
