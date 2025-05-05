import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
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
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.use("/cms", cmsRouter);
  app.use(errorHandler);
  app.use("/", (req, res) => {
    res.send("Hello from product-microservice1");
  });
  return app;
}
