import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { UniversalError } from "../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/winston";

const AUTH_MICROSERVICE_URL = process.env.AUTH_MICROSERVICE_URL;
const AUTH_FLAG = process.env.AUTH_FLAG;

export function authenticate() {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    const cookies = req.cookies;
    const betterAuthCookie = cookies["better-auth.session_token"];
    try {
      if (AUTH_FLAG === "false") {
        throw new Error();
      }
      const response = await fetch(
        `${AUTH_MICROSERVICE_URL}/api/auth/get-session`,
        {
          method: "GET",
          headers: {
            Cookie: `better-auth.session_token=${betterAuthCookie}`,
          },
          credentials: "include",
        },
      );
      const data = await response.json();
      logger.info({
        level: "info",
        message: `User ${data.user.id} authenticated with role: ${data.user.role}`,
      });
      req.headers["user-context"] = Buffer.from(
        JSON.stringify(data.user),
      ).toString("base64");
      next();
    } catch (err: any) {
      if (AUTH_FLAG === "false") {
        const fakeUser = {
          id: "provided-fake-id-string124",
          role: "COORDINATOR",
        };
        req.headers["user-context"] = Buffer.from(
          JSON.stringify(fakeUser),
        ).toString("base64");
        next();
      } else {
        throw new UniversalError(
          StatusCodes.UNAUTHORIZED,
          "Error while authenticating",
          [],
        );
      }
    }
  };
}
