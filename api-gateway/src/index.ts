import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/authenticate";
import { errorHandler } from "./middlewares/errorHandler";
import { UniversalError } from "./errors/UniversalError";
import { StatusCodes } from "http-status-codes";

const app = express();
const PORT = process.env.PORT || 8000;
const PRODUCT_MICROSERVICE_URL = process.env.PRODUCT_MICROSERVICE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const AUTH_MICROSERVICE_URL = process.env.AUTH_MICROSERVICE_URL;
const ENROLL_MICROSERVICE_URL = process.env.ENROLL_MICROSERVICE_URL;
const PROFILE_MICROSERVICE_URL = process.env.PROFILE_MICROSERVICE_URL;
const NOTIFICATION_MICROSERVICE_URL = process.env.NOTIFICATION_MICROSERVICE_URL;
const ELASTICSEARCH_MICROSERVICE_URL =
  process.env.ELASTICSEARCH_MICROSERVICE_URL;
const BLOG_MICROSERVICE_URL = process.env.BLOG_MICROSERVICE_URL;
const NODE_ENV = process.env.NODE_ENV;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(cookieParser());

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
    pathRewrite: (path, req) => req.originalUrl.replace("/product", ""),
  });
  if (NODE_ENV === "development") {
    app.use("/product/api-docs", proxyMiddlewareProduct);
  }
  app.use(
    "/product/public/schedule",
    authenticate({ strict: false }),
    proxyMiddlewareProduct,
  );
  app.use("/product/public", proxyMiddlewareProduct);
  app.use("/product", authenticate(), proxyMiddlewareProduct);
}

if (ENROLL_MICROSERVICE_URL) {
  const proxyMiddlewareEnroll = createProxyMiddleware<Request, Response>({
    target: ENROLL_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace("/enroll", ""),
  });

  if (NODE_ENV === "development") {
    app.use("/enroll/api-docs", proxyMiddlewareEnroll);
  }
  app.use("/enroll/stripe/webhook", proxyMiddlewareEnroll);
  app.use("/enroll", authenticate(), proxyMiddlewareEnroll);
}

if (PROFILE_MICROSERVICE_URL) {
  const proxyMiddlewareProfile = createProxyMiddleware<Request, Response>({
    target: PROFILE_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace("/profile", ""),
  });

  if (NODE_ENV === "development") {
    app.use("/profile/api-docs", proxyMiddlewareProfile);
  }
  app.use("/profile/public", proxyMiddlewareProfile);
  app.use("/profile", authenticate(), proxyMiddlewareProfile);
}

if (NOTIFICATION_MICROSERVICE_URL) {
  const proxyMiddlewareNotification = createProxyMiddleware<Request, Response>({
    target: NOTIFICATION_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace("/notification", ""),
  });

  if (NODE_ENV === "development") {
    app.use("/notification/api-docs", proxyMiddlewareNotification);
  }
  app.use("/notification", authenticate(), proxyMiddlewareNotification);
}

if (ELASTICSEARCH_MICROSERVICE_URL) {
  const proxyMiddlewareElasticsearch = createProxyMiddleware<Request, Response>(
    {
      target: ELASTICSEARCH_MICROSERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path, req) => req.originalUrl.replace("/elasticsearch", ""),
    },
  );

  if (NODE_ENV === "development") {
    app.use("/elasticsearch/api-docs", proxyMiddlewareElasticsearch);
  }
  app.use("/elasticsearch", authenticate(), proxyMiddlewareElasticsearch);
}

if (BLOG_MICROSERVICE_URL) {
  const proxyMiddlewareBlog = createProxyMiddleware<Request, Response>({
    target: BLOG_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: (_path, req) => req.originalUrl.replace("/blog", ""),
  });

  if (NODE_ENV === "development") {
    app.use("/blog/api-docs", proxyMiddlewareBlog);
  }
  app.use("/blog/public", proxyMiddlewareBlog);
  app.use("/blog", authenticate(), proxyMiddlewareBlog);
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
