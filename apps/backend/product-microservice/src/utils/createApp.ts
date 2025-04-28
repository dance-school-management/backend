import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import coordinator from "../routes/coordinator";
import course from "../routes/cms/courses";
import traineeSchedule from "../routes/trainee/schedule";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import cmsRouter from "../routes/cms/cms";
import path from "path";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use("/coordinator", coordinator);
  app.use("/course", course);
  app.use("/trainee/schedule", traineeSchedule);
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.use("/cms", cmsRouter);
  app.use(errorHandler);
  return app;
}
