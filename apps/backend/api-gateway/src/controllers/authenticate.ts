import { NextFunction, Request, Response } from "express";
import "dotenv/config";

const AUTH_MICROSERVICE_URL = process.env.AUTH_MICROSERVICE_URL;

export function authenticate(requiredRole?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    const betterAuthCookie = cookies["better-auth.session_token"];
    console.log(betterAuthCookie);
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
      console.log(data.user.role);
      if (data.user.role !== requiredRole) {
        res.json({
          message: `You have no permissions. You are ${data.user.role}.`,
        });
        return;
      }
      next();
    } catch (err: any) {
      res.status(500).json({ message: "Auth server error." });
      return;
    }
  };
}
