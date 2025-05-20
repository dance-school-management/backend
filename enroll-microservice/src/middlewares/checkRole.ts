import { NextFunction, Request, Response } from "express";
import logger from "../utils/winston";
import { UniversalError } from "../errors/UniversalError";
import { StatusCodes } from "http-status-codes";

export function checkRole(roles: string[]) {
  return (
    req: Request & { user?: any },
    res: Response,
    _next: NextFunction,
  ) => {
    if (req.user) {
      const userRole = req.user.role;
      if (roles.includes(userRole)) {
        logger.info({
          level: "info",
          message: `User ${req.user.id} has role ${userRole} and is authorized to access ${req.originalUrl}`,
        });
        _next();
      } else {
        logger.error({
          level: "error",
          message: `User ${req.user.id} is not authorized to access ${req.originalUrl}`,
        });
        throw new UniversalError(
          StatusCodes.UNAUTHORIZED,
          `You are not authorized to access ${req.originalUrl} as ${userRole}`,
          [],
        );
      }
    } else {
      throw new UniversalError(
        StatusCodes.UNAUTHORIZED,
        "Problem with accessing user role in enroll-microservice",
        [],
      );
    }
  };
}
