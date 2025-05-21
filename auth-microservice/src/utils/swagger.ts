import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response, Router } from "express";
import "dotenv/config";

const router = Router();

const API_GATEWAY_URL = process.env.API_GATEWAY_URL;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "auth API Docs",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000/auth",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

router.use("/api-docs", swaggerUi.serve, (req: Request, res: Response) => {
  let html = swaggerUi.generateHTML(swaggerSpec);
  res.send(html);
});

export default router;
export const swaggerDocument = swaggerSpec;
