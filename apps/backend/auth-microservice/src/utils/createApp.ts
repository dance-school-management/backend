import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cookieParser from "cookie-parser";

export function createApp() {
  const app = express();

  app.use(morgan("tiny"));
  app.all("/api/auth/{*any}", toNodeHandler(auth));
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use(errorHandler);
  app.get("/", (req, res) => {
    res.send("Hello from auth-microservice");
  });
  return app;
}
