import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import coordinator from "../routes/coordinator";
import course from "../routes/cms/courses";
import traineeSchedule from "../routes/trainee/schedule";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";

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
  app.use(errorHandler);
  return app;
}
