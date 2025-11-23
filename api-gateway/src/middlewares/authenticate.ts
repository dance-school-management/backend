import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import logger from "../utils/winston";
import { StatusCodes } from "http-status-codes";

const AUTH_MICROSERVICE_URL = process.env.AUTH_MICROSERVICE_URL;
const AUTH_TIMEOUT_MS = process.env.AUTH_TIMEOUT_MS
  ? parseInt(process.env.AUTH_TIMEOUT_MS)
  : 2000;

export function authenticate() {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    const cookies = req.cookies;
    const betterAuthCookie = cookies["better-auth.session_token"];

    if (!betterAuthCookie) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      headers["Cookie"] = `better-auth.session_token=${betterAuthCookie}`;

      const response = await fetch(
        `${AUTH_MICROSERVICE_URL}/api/auth/get-session`,
        {
          method: "GET",
          headers,
          signal: controller.signal,
        },
      );

      clearTimeout(timeout);

      if (
        response.status === StatusCodes.UNAUTHORIZED ||
        response.status === StatusCodes.FORBIDDEN
      ) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
      }

      if (!response.ok) {
        logger.error({
          level: "error",
          message: "Auth service error",
          status: response.status,
        });
        res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        logger.error({
          level: "error",
          message: "Unexpected content-type from auth service",
          contentType,
        });
        res.sendStatus(StatusCodes.BAD_GATEWAY);
        return;
      }

      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        logger.error({
          level: "error",
          message: "Failed to parse auth response JSON",
          error: e,
        });
        res.sendStatus(StatusCodes.BAD_GATEWAY);
        return;
      }

      const user = data?.user;
      if (!user || typeof user !== "object" || !user.id || !user.role) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
      }

      logger.info({
        level: "info",
        message: `Authenticated user id=${String(user.id)} role=${String(user.role)}`,
      });
      req.headers["user-context"] = Buffer.from(
        JSON.stringify(data.user),
      ).toString("base64");
      next();
      return;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err?.name === "AbortError") {
        logger.error({
          level: "error",
          message: "Auth fetch timeout",
        });
        res.sendStatus(StatusCodes.REQUEST_TIMEOUT);
        return;
      }
      logger.error({
        level: "error",
        message: "Error in authentication middleware",
        error: err?.message ?? err,
      });
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }
  };
}
