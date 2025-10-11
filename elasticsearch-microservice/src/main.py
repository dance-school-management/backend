from typing import List, Literal
from fastapi import FastAPI
from src.elastic import esClientDocker
from src.grpc_service.server import serve_gRPC
from src.model import embed
from src.grpc_client.productCommunication.getCoursesData import getCoursesData
from pydantic import BaseModel
import threading

app = FastAPI()



class SearchRequest(BaseModel):
  entity: Literal["courses", "class_templates"]
  searchQuery: str
  danceCategoriesIds: List[int]
  advancementLevelsIds: List[int]
  priceMin: float
  priceMax: float
  
@app.get("/hello")
async def hello():
  esClientDocker.index(index="hello", document={"content": "hello world"})
  return {"Hello": "World"}

@app.post("/search")
async def search(request: SearchRequest):

  query_vector = embed(request.searchQuery, is_query=True)

  filters = []

  if len(request.danceCategoriesIds) > 0:
      filters.append({"terms": {"dance_category.id": request.danceCategoriesIds}})

  if len(request.advancementLevelsIds) > 0:
      filters.append({"terms": {"advancement_level.id": request.advancementLevelsIds}})

  filters.append({
      "range": {
          "price": {
              "gte": request.priceMin,
              "lte": request.priceMax
          }
      }
  })

  knn = {
      "field": "description_embedded",
      "query_vector": query_vector,
      "k": 20,
      "num_candidates": 100,
      "filter": {
          "bool": {
              "must": filters
          }
      }
  }

  res = esClientDocker.search(index=request.entity, knn=knn, size=20)
  
  result = []

  for hit in res.body["hits"]["hits"]:
    new_result = {"document": {k: v for k, v in hit["_source"].items() if k != "description_embedded"}, 
                  "score": hit["_score"]}
    result.append(new_result)

  result.sort(key=lambda r: r["score"], reverse=True)

  return result


threading.Thread(target=serve_gRPC, daemon=True).start()
