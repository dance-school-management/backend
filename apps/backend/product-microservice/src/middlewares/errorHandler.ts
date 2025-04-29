import { NextFunction, Request, Response } from "express";
import { prismaError } from "prisma-better-errors";
import { ExValError } from "../errors/ExValError";
import { StatusCodes } from "http-status-codes";
import { exErrJsonBuilder } from "../utils/errorHelpers";
import { Prisma } from "../../generated/client";
import logger from "../utils/winston";

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

  if (err instanceof ExValError) {
    res.status(err.statusCode).json(exErrJsonBuilder(err));
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const customPrismaError = new prismaError(err);
    res.status(customPrismaError.statusCode).json({
      title: customPrismaError.title,
      message: customPrismaError.message,
      metaData: customPrismaError.metaData,
    });
    return;
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    title: "Internal Server Error",
    message: "An unexpected error occurred.",
    metaData: {
      error: err.message,
    },
  });
}
