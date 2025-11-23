import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import { errorHandler } from "../middlewares/errorHandler";
import morgan from "morgan";
import helmet from "helmet";
import { UniversalError } from "../errors/UniversalError";
import { handleUserContext } from "../middlewares/handleUserContext";
import { checkRole } from "../middlewares/checkRole";
import unprotectedRouter from "../routes/unprotected/unprotected";
import userRouter from "../routes/user/profile";
import searchRouter from "../routes/search-users/search";
import path from "path";

export function createApp() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.use("/", unprotectedRouter);
  app.use(handleUserContext);
  app.use("/user", userRouter);
  app.use("/search", checkRole(["INSTRUCTOR", "COORDINATOR"]), searchRouter);
  app.get("/", (req, res) => {
    res.send("Hello from profile-microservice");
  });
  app.use((req, res) => {
    throw new UniversalError(404, "Endpoint not found", []);
  });
  app.use(errorHandler);
  return app;
}
