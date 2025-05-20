import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/winston";
import { UniversalError } from "../errors/UniversalError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error({
    level: "error",
    message: err.message,
  });

  if (err instanceof UniversalError) {
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
