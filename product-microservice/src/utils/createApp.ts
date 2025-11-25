import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { UniversalError } from "../errors/UniversalError";
import { checkRole } from "../middlewares/checkRole";
import { errorHandler } from "../middlewares/errorHandler";
import { handleUserContext } from "../middlewares/handleUserContext";
import cmsRouter from "../routes/cms/cms";
import publicCmsRouter from "../routes/cms/publicCms";
import pricingRouter from "../routes/pricing/pricing";
import privateClassesRouter from "../routes/private_classes/privateClasses";
import publicScheduleRouter from "../routes/schedule/publicSchedule";
import scheduleRouter from "../routes/schedule/schedule";
import { setupSwagger } from "./swagger";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV === "development") {
    setupSwagger(app);
  }
  app.use("/public/schedule", publicScheduleRouter);
  app.use("/public/pricing", pricingRouter);
  app.use("/public/cms", publicCmsRouter);
  app.use(handleUserContext);
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.use("/cms", checkRole(["COORDINATOR"]), cmsRouter);
  app.use("/schedule", checkRole(["STUDENT", "INSTRUCTOR"]), scheduleRouter);
  app.use("/private-class", checkRole(["INSTRUCTOR"]), privateClassesRouter);
  app.get("/", (req, res) => {
    res.send("Hello from product-microservice1");
  });
  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });
  app.use(errorHandler);
  return app;
}
