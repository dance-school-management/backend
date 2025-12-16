import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import { UniversalError } from "../errors/UniversalError";
import { handleUserContext } from "../middlewares/handleUserContext";
import { checkRole } from "../middlewares/checkRole";
import postRouter from "../routes/post/post";
import publicRouter from "../routes/post/public";

export function createApp() {
  const app = express();
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("tiny"));
  }
  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === "development") {
    setupSwagger(app);
  }

  // Public routes (no authentication required)
  app.use("/public", publicRouter);

  // Authenticated routes - admin/coordinator
  app.use(handleUserContext);
  app.use("/posts", checkRole(["admin", "COORDINATOR"]), postRouter);

  app.get("/", (req, res) => {
    res.send("Hello from blog-microservice");
  });

  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });

  app.use(errorHandler);
  return app;
}
