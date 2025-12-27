import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import orderRouter from "../routes/order/order";
import ticketRetrieveRouter from "../routes/ticket/ticketRetrieve";
import ticketScanRouter from "../routes/ticket/ticketScan";
import { UniversalError } from "../errors/UniversalError";
import { handleUserContext } from "../middlewares/handleUserContext";
import { checkRole } from "../middlewares/checkRole";
import webhookRouter from "../routes/stripe/webhooks/webhook";
import progressRouter from "../routes/student-progress/studentProgress";
import adminRouter from "../routes/finances/financialEndpoints";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());

  app.use("/stripe/webhook", webhookRouter);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === "development") {
    setupSwagger(app);
  }
  app.use(handleUserContext);
  app.use("/order", checkRole(["STUDENT"]), orderRouter);
  app.use("/progress", checkRole(["STUDENT"]), progressRouter);
  app.use("/ticket/retrieve", checkRole(["STUDENT"]), ticketRetrieveRouter);
  app.use("/ticket/scan", checkRole(["COORDINATOR"]), ticketScanRouter);
  app.use("/admin", adminRouter);
  app.get("/", (req, res) => {
    res.send("Hello from enroll-microservice");
  });
  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });
  app.use(errorHandler);
  return app;
}
