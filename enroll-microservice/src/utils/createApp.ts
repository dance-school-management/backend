import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import orderRouter from "../routes/order/order";
import ticketRouter from "../routes/ticket/ticket";
import { UniversalError } from "../errors/UniversalError";
import { handleUserContext } from "../middlewares/handleUserContext";
import { checkRole } from "../middlewares/checkRole";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use(handleUserContext);
  app.use("/order", checkRole(["STUDENT"]), orderRouter);
  app.use("/ticket/student", checkRole(["STUDENT"]), ticketRouter);
  app.use("/ticket/instructor", checkRole(["INSTRUCTOR"]), ticketRouter);
  app.get("/", (req, res) => {
    res.send("Hello from enroll-microservice");
  });
  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });
  app.use(errorHandler);
  return app;
}
