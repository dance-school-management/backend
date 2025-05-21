import express from "express";
import "dotenv/config";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cookieParser from "cookie-parser";
import { UniversalError } from "../errors/UniversalError";
import userRouter from "../routes/user/user";
import swaggerRouter from "./swagger";
import swaggerBetterAuthRouter from "./swaggerBetterAuth";
export function createApp() {
  const app = express();

  app.use(morgan("tiny"));
  app.all("/api/auth/{*any}", toNodeHandler(auth));
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/1", swaggerRouter);
  app.use("/2", swaggerBetterAuthRouter);
  app.use("/", userRouter);
  app.get("/", (req, res) => {
    res.send("Hello from auth-microservice");
  });
  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });
  app.use(errorHandler);
  return app;
}
