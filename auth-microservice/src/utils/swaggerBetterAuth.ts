import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import { auth } from "./auth";
import { Express, Request, Response, Router } from "express";

const router = Router();

const API_GATEWAY_URL = process.env.API_GATEWAY_URL;

(async function () {
  const betterAuthSchema = await auth.api.generateOpenAPISchema();
  betterAuthSchema.servers = [
    {
      url: "http://localhost:8000/auth/api/auth",
    },
  ];

  if (
    betterAuthSchema.paths &&
    betterAuthSchema.paths["/sign-up/email"] &&
    betterAuthSchema.paths["/sign-up/email"].post
  ) {
    const requestBody =
      betterAuthSchema.paths["/sign-up/email"].post.requestBody;
    if (
      requestBody &&
      requestBody.content &&
      requestBody.content["application/json"]
    ) {
      const schema = requestBody.content["application/json"].schema;
      if (schema && schema.properties) {
        schema.properties["first_name"] = { type: "string" };
        schema.properties["surname"] = { type: "string" };
        schema.properties["id"] = { type: "string" };
        if (Array.isArray(schema.required)) {
          schema.required.push("first_name", "surname");
        }
      }
    }
  }

  router.use("/api-docs", swaggerUi.serve, (req: Request, res: Response) => {
    let html = swaggerUi.generateHTML(betterAuthSchema);
    res.send(html);
  });
})();

export default router;
