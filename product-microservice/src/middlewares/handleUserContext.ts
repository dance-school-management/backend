import { NextFunction, Request, Response } from "express";
import logger from "../utils/winston";

export function handleUserContext(
  req: Request & { user?: any },
  res: Response,
  _next: NextFunction,
) {
  console.log(req.originalUrl)
  try {
    const userHeader = req.headers["user-context"] as string;
    const user = JSON.parse(Buffer.from(userHeader, "base64").toString("utf8"));
    req.user = user;
    if (!req.user) {
      logger.info({
        level: "info",
        message: "User context not found in request headers",
      });
    }
  } catch (err) {
    logger.info({
      level: "info",
      message: `Error while parsing user context:`,
    });
  }
  _next();
}
