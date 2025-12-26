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

  addFieldsToRequest(
    "/sign-up/email",
    [
      { name: "first_name", type: "string", required: true },
      { name: "surname", type: "string", required: true },
      { name: "id", type: "string" },
      { name: "role", type: "string", default: "STUDENT" },
    ],
    betterAuthSchema,
  );

  addFieldsToRequest(
    "/admin/create-user",
    [
      { name: "first_name", type: "string", required: true },
      { name: "surname", type: "string", required: true },
      { name: "id", type: "string" },
      { name: "role", type: "string", required: true, default: "INSTRUCTOR" },
      { name: "shouldSendEmail", type: "boolean", default: false },
    ],
    betterAuthSchema,
  );

  removeFieldsFromRequest(
    "/admin/create-user",
    [{ name: "data" }],
    betterAuthSchema,
  );

  router.use("/api-docs", swaggerUi.serve, (req: Request, res: Response) => {
    let html = swaggerUi.generateHTML(betterAuthSchema);
    res.send(html);
  });
})();

function addFieldsToRequest(
  path: string,
  fields: { name: string; type: string; default?: any; required?: boolean }[],
  betterAuthSchema: any,
) {
  if (betterAuthSchema.paths?.[path].post) {
    const requestBody = betterAuthSchema.paths?.[path].post.requestBody;
    if (requestBody?.content?.["application/json"]) {
      const schema = requestBody.content["application/json"].schema;
      if (schema?.properties) {
        fields.forEach((field) => {
          schema.properties[field.name] = {
            type: field.type,
            ...(field.default !== undefined && { default: field.default }),
          };
        });
        if (Array.isArray(schema.required)) {
          fields.forEach((field) => {
            if (field.required) {
              schema.required.push(field.name);
            }
          });
        }
      }
    }
  }
}

function removeFieldsFromRequest(
  path: string,
  fields: { name: string }[],
  betterAuthSchema: any,
) {
  if (betterAuthSchema.paths?.[path].post) {
    const requestBody = betterAuthSchema.paths?.[path].post.requestBody;
    if (requestBody?.content?.["application/json"]) {
      const schema = requestBody.content["application/json"].schema;
      if (schema?.properties) {
        fields.forEach((field) => {
          schema.properties[field.name] = undefined;
        });
      }
    }
  }
}

export default router;
