from typing import List, Literal
from fastapi import FastAPI, Depends, Query
from src.elastic import esClientDocker
from src.grpc_service.server import serve_gRPC
from src.model import embed
from src.grpc_client.productCommunication.getCoursesData import getCoursesData
from pydantic import BaseModel, Field
import threading

app = FastAPI(
  root_path="/elasticsearch",
  docs_url="/api-docs",
  openapi_url="/openapi.json"
)
  
@app.get("/hello")
async def hello():
  esClientDocker.index(index="hello", document={"content": "hello world"})
  return {"Hello": "World"}

@app.get("/search")
async def search(
  entity: Literal["courses", "class_templates"] = Query(),
  searchQuery: str = Query(..., example="Ballet for children"),
  danceCategoriesIds: List[int] = Query(..., example=[1, 2, 3, 5]),
  advancementLevelsIds: List[int] = Query(..., example=[1, 2]),
  priceMin: float = Query(..., example=20),
  priceMax: float = Query(..., example=300),
  topK: int = Query(..., example=5),
  numCandidates: int = Query(..., example=50)
):

  query_vector = embed(searchQuery, is_query=True)

  filters = []

  if len(danceCategoriesIds) > 0:
      filters.append({"terms": {"dance_category.id": danceCategoriesIds}})

  if len(advancementLevelsIds) > 0:
      filters.append({"terms": {"advancement_level.id": advancementLevelsIds}})

  filters.append({
      "range": {
          "price": {
              "gte": priceMin,
              "lte": priceMax
          }
      }
  })

  knn = {
      "field": "description_embedded",
      "query_vector": query_vector,
      "k": topK,
      "num_candidates": numCandidates,
      "filter": {
          "bool": {
              "must": filters
          }
      }
  }

  res = esClientDocker.search(index=entity, knn=knn, size=topK)
  
  result = []

  for hit in res.body["hits"]["hits"]:
    new_result = {"document": {k: v for k, v in hit["_source"].items() if k != "description_embedded"}, 
                  "score": hit["_score"]}
    result.append(new_result)

  result.sort(key=lambda r: r["score"], reverse=True)

  return result


threading.Thread(target=serve_gRPC, daemon=True).start()
