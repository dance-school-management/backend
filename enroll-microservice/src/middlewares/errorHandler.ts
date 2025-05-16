import { NextFunction, Request, Response } from "express";
import { prismaError } from "prisma-better-errors";
import { StatusCodes } from "http-status-codes";
import { getWrongFields, warningJsonBuilder } from "../utils/errorHelpers";
import { Prisma } from "../../generated/client";
import logger from "../utils/winston";
import { Warning } from "../errors/Warning";
import { UniversalError } from "../errors/UniversalError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error({
    level: "error",
    message: err.message,
  });

  if (err instanceof UniversalError) {
    res.status(err.statusCode).json(err);
    return;
  }
  if (err instanceof Warning) {
    res.status(err.statusCode).json(warningJsonBuilder(err));
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaBetterEr = new prismaError(err);
    const status = prismaBetterEr.statusCode || StatusCodes.BAD_REQUEST;
    const wrongFields = getWrongFields(err);
    const uniErr = new UniversalError(
      status,
      "Problem with the request - check the data",
      wrongFields,
    );
    res.status(status).json(uniErr);
    return;
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    const validationError = new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Validation error - wrong types or missing fields",
      [],
    );
    res.status(validationError.statusCode).json(validationError);
    return;
  }
  if (
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    const err = new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Database related error",
      [],
    );
    res.status(err.statusCode).json(err);
    return;
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    name: "UnknownError",
    message: err.message,
    errors: [],
  });
  return;
}
