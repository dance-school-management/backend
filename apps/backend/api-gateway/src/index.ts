import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;
const PRODUCT_MICROSERVICE_URL = process.env.PRODUCT_MICROSERVICE_URL;

const proxyMiddlewareProduct = createProxyMiddleware<Request, Response>({
  target: PRODUCT_MICROSERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/product": "",
  },
});

app.use("/product", proxyMiddlewareProduct);

app.get("/", (req: Request, res) => {
  res.send("Hello from api-gateway");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
