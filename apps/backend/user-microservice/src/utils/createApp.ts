import express from "express";
import "dotenv/config";
import { setupSwagger } from "./swagger";
import coordinator from "../routes/coordinator";
import cmsRouter from "../routes/cms/cms"

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use("/coordinator", coordinator);
  app.use("/cms", cmsRouter);
  return app;
}
