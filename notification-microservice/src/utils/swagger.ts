import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import "dotenv/config";

const API_GATEWAY_URL = process.env.API_GATEWAY_URL;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "products API Docs",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000/notification",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export const swaggerDocument = swaggerSpec;
