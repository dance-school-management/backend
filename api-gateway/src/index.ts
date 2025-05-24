import express, { NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticate } from "./controllers/authenticate";
import { errorHandler } from "./middlewares/errorHandler";
import { UniversalError } from "./errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import logger from "./utils/winston";

const app = express();
const PORT = process.env.PORT || 8000;
const PRODUCT_MICROSERVICE_URL = process.env.PRODUCT_MICROSERVICE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const AUTH_MICROSERVICE_URL = process.env.AUTH_MICROSERVICE_URL;
const ENROLL_MICROSERVICE_URL = process.env.ENROLL_MICROSERVICE_URL;
const PROFILE_MICROSERVICE_URL = process.env.PROFILE_MICROSERVICE_URL;
const NODE_ENV = process.env.NODE_ENV;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());

//app.get("/test", authenticate("student"));

if (AUTH_MICROSERVICE_URL) {
  const proxyMiddlewareAuth = createProxyMiddleware<Request, Response>({
    target: AUTH_MICROSERVICE_URL,
    changeOrigin: true,
  });
  app.use("/auth", proxyMiddlewareAuth);
}

if (PRODUCT_MICROSERVICE_URL) {
  const proxyMiddlewareProduct = createProxyMiddleware<Request, Response>({
    target: PRODUCT_MICROSERVICE_URL,
    changeOrigin: true,
  });
  const proxyMiddlewareProductApiDocs = createProxyMiddleware<
    Request,
    Response
  >({
    target: PRODUCT_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const currPath = req.originalUrl;
      return currPath.replace("/product", "");
    },
  });
  if (NODE_ENV === "development") {
    app.use("/product/api-docs", proxyMiddlewareProductApiDocs);
  }
  app.use("/product", authenticate(), proxyMiddlewareProduct);
}

if (ENROLL_MICROSERVICE_URL) {
  const proxyMiddlewareEnroll = createProxyMiddleware<Request, Response>({
    target: ENROLL_MICROSERVICE_URL,
    changeOrigin: true,
  });

  const proxyMiddlewareEnrollApiDocs = createProxyMiddleware<Request, Response>(
    {
      target: ENROLL_MICROSERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        const currPath = req.originalUrl;
        return currPath.replace("/enroll", "");
      },
    },
  );
  if (NODE_ENV === "development") {
    app.use("/enroll/api-docs", proxyMiddlewareEnrollApiDocs);
  }
  app.use("/enroll", authenticate(), proxyMiddlewareEnroll);
}

if (PROFILE_MICROSERVICE_URL) {
  const proxyMiddlewareProfile = createProxyMiddleware<Request, Response>({
    target: PROFILE_MICROSERVICE_URL,
    changeOrigin: true,
  });

  const proxyMiddlewareProfileApiDocs = createProxyMiddleware<
    Request,
    Response
  >({
    target: PROFILE_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const currPath = req.originalUrl;
      return currPath.replace("/profile", "");
    },
  });
  if (NODE_ENV === "development") {
    app.use("/profile/api-docs", proxyMiddlewareProfileApiDocs);
  }
  app.use("/profile", authenticate(), proxyMiddlewareProfile);
}

app.get("/", (req: Request, res) => {
  res.send("Hello from api-gateway");
});

app.use((req: Request, res) => {
  throw new UniversalError(StatusCodes.NOT_FOUND, "Route not found", []);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
