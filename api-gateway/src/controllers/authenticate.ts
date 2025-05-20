import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { UniversalError } from "../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/winston";

const AUTH_MICROSERVICE_URL = process.env.AUTH_MICROSERVICE_URL;

export function authenticate() { //requiredRole: string[]
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    const cookies = req.cookies;
    const betterAuthCookie = cookies["better-auth.session_token"];
    try {
      const response = await fetch(
        `${AUTH_MICROSERVICE_URL}/api/auth/get-session`,
        {
          method: "GET",
          headers: {
            Cookie: `better-auth.session_token=${betterAuthCookie}`,
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      logger.info({
        level: "info",
        message: `User ${data.user.id} authenticated with role: ${data.user.role}`
      });
      // if (!requiredRole.includes(data.user.role)) {
      //   logger.error({
      //     level: "error",
      //     message: `User ${data.user.id} is not authorized to access this resource as ${data.user.role}`
      //   });
      //   throw new UniversalError(
      //     StatusCodes.UNAUTHORIZED,
      //     `You are not authorized to access this resource as ${data.user.role}`,
      //     []
      //   );
      // }
      // req.user = data.user;
      //console.log(req.user);
      req.headers["user-context"] = Buffer.from(
        JSON.stringify(data.user)
      ).toString("base64");
      next();
    } catch (err: any) {
      throw new UniversalError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while authenticating",
        []
      );
    }
  };
}
