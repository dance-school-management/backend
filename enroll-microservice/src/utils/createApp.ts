import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import orderRouter from "../routes/order/order";
import { UniversalError } from "../errors/UniversalError";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use("/order", orderRouter);
  app.get("/", (req, res) => {
    res.send("Hello from enroll-microservice");
  });
  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });
  app.use(errorHandler);
  return app;
}
