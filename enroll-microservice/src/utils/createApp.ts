import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import orderRouter from "../routes/order/order";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use("/order", orderRouter);
  app.use(errorHandler);
  app.get("/", (req, res) => {
    res.send("Hello from enroll-microservice");
  });
  return app;
}
