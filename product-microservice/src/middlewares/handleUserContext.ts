import { NextFunction, Request, Response } from "express";

export function handleUserContext(
  req: Request & { user?: any; },
  res: Response,
  _next: NextFunction,
) {
  try {
    const userHeader = req.headers["user-context"] as string;
    const user = JSON.parse(Buffer.from(userHeader, "base64").toString("utf8"));
    req.user = user;
  } catch (err) {
    // Failed to parse user-context header; log at debug level for diagnostics
    console.debug("Failed to parse user-context header:", err);
  }
  _next();
}
