import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validator";
import { prismaError } from "prisma-better-errors";
interface ErrorObject {
  message: string[];
}

export function errorHandler(
  err: Error & { errors: ValidationError[] },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let errors = [];
  if (err instanceof prismaError) {
    res.status(err.statusCode);
  }
  if (err.errors) {
    errors = err.errors.map((object) => object.msg);
  }
  const errorObject: ErrorObject = {
    message: errors.concat(err.message || []),
  };
  res.json(errorObject);
}
