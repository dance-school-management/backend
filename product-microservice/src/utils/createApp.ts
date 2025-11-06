import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import cmsRouter from "../routes/cms/cms";
import path from "path";
import { UniversalError } from "../errors/UniversalError";
import { handleUserContext } from "../middlewares/handleUserContext";
import { checkRole } from "../middlewares/checkRole";
import scheduleRouter from "../routes/schedule/schedule";
import pricingRouter from "../routes/pricing/pricing";
import searchRouter from "../routes/advanced-search/search";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use(handleUserContext);
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.use("/cms", checkRole(["COORDINATOR"]), cmsRouter);
  app.use("/schedule", scheduleRouter);
  app.use("/pricing", pricingRouter);
  app.use("/search", searchRouter);
  app.get("/", (req, res) => {
    res.send("Hello from product-microservice1");
  });
  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });
  app.use(errorHandler);
  return app;
}
