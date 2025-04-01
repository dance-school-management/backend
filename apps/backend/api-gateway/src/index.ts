import express, { Request, Response } from "express";
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 7999;

const proxyMiddlewareEx1 = createProxyMiddleware<Request, Response>(  {
  target: "http://ex-mic-1:8000",
  changeOrigin: true,
  pathRewrite: {
    "^/ex1": ""
  }
})

const proxyMiddlewareEx2 = createProxyMiddleware<Request, Response>(  {
  target: "http://ex-mic-2:8001",
  changeOrigin: true,
  pathRewrite: {
    "^/ex2": ""
  }
})

app.use('/ex1', proxyMiddlewareEx1);
app.use('/ex2', proxyMiddlewareEx2);


app.get("/", (req: Request, res) => {
  res.send("Hello from api-gateway");
});







app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
