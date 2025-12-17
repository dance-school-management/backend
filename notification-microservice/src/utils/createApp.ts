import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { checkRole } from "../middlewares/checkRole";
import { errorHandler } from "../middlewares/errorHandler";
import { handleUserContext } from "../middlewares/handleUserContext";
import notificationRouter from "../routes/notification/notification";
import notificationCoordinatorRouter from "../routes/notification/notificationManagement";
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
  app.use(handleUserContext);
  app.use("/public/notification", notificationRouter);
  app.use("/notification", checkRole(["INSTRUCTOR", "COORDINATOR", "ADMINISTRATOR"]), notificationCoordinatorRouter);
  app.use(errorHandler);
  app.get("/", (req, res) => {
    res.send("Hello from notification-microservice");
  });
  return app;
}
