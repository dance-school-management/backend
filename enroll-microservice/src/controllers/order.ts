import { NextFunction, Request, Response } from "express";
import { checkClass, checkCourse } from "../grpc/order/order";
import { ClassTicket, CourseTicket } from "../../generated/client";
import { checkValidations } from "../utils/errorHelpers";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export async function makeClassOrder(
  req: Request<object, object, ClassTicket>,
  res: Response,
) {
  checkValidations(validationResult(req));
  const { classId, studentId } = req.body;
  const response = await checkClass(classId); // asks the product-microservice if the class is available
  // asks the payment-microservice for starting transaction and the result
  res.status(StatusCodes.OK).json(response);
}
export async function makeCourseOrder(
  req: Request<object, object, CourseTicket>,
  res: Response,
) {
  checkValidations(validationResult(req));
  const { courseId, studentId } = req.body;
  const response = await checkCourse(courseId); // asks the product-microservice if the class is available
  // asks the payment-microservice for starting transaction and the result
  res.status(StatusCodes.OK).json(response);
}
