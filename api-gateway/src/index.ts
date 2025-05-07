import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticate } from "./controllers/authenticate";

const app = express();
const PORT = process.env.PORT || 8000;
const PRODUCT_MICROSERVICE_URL = process.env.PRODUCT_MICROSERVICE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const AUTH_MICROSERVICE_URL = process.env.AUTH_MICROSERVICE_URL;
const ENROLL_MICROSERVICE_URL = process.env.ENROLL_MICROSERVICE_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

//app.get("/test", authenticate("student"));

if (AUTH_MICROSERVICE_URL) {
  const proxyMiddlewareAuth = createProxyMiddleware<Request, Response>({
    target: AUTH_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "",
    },
  });
  app.use("/auth", proxyMiddlewareAuth);
}

if (PRODUCT_MICROSERVICE_URL) {
  const proxyMiddlewareProduct = createProxyMiddleware<Request, Response>({
    target: PRODUCT_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/product": "",
    },
  });
  app.use("/product", proxyMiddlewareProduct);
}

if (ENROLL_MICROSERVICE_URL) {
  const proxyMiddlewareEnroll = createProxyMiddleware<Request, Response>({
    target: ENROLL_MICROSERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/enroll": "",
    },
  });
  app.use("/enroll", proxyMiddlewareEnroll);
}

app.get("/", (req: Request, res) => {
  res.send("Hello from api-gateway1");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
