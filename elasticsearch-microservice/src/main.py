from fastapi import FastAPI
from src.elastic import esClient
from src.grpc_service.server import serve_gRPC
import threading

app = FastAPI()

@app.get("/hello")
async def hello():
  esClient.index(index="hello", document={"content": "hello world"})
  return {"Hello": "World"}

threading.Thread(target=serve_gRPC, daemon=True).start()
