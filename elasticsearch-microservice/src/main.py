from fastapi import FastAPI
from src.elastic import esClient
from src.grpc_service.server import serve_gRPC
from src.model import embed
from pydantic import BaseModel
import threading

app = FastAPI()

class SearchCourseRequest(BaseModel):
  searchQuery: str
  danceCategoryId: int
  advancementLevelId: int
  priceMin: float
  priceMax: float
  
@app.get("/hello")
async def hello():
  esClient.index(index="hello", document={"content": "hello world"})
  return {"Hello": "World"}

@app.post("/search/course")
async def searchCourse(request: SearchCourseRequest):

  query_vector = embed(request.searchQuery, is_query=True)

  knn = {
    "field": "description_embedded",
    "query_vector": query_vector,
    "k": 3,
    "num_candidates": 50,
    "filter": {
        "bool": {
            "must": [
                {"term": {"dance_category_id": request.danceCategoryId}},
                {"term": {"advancement_level_id": request.advancementLevelId}},
                {"range": {"price": {"gte": request.priceMin, "lte": request.priceMax}}}
            ]
        }
    }
  }

  res = esClient.search(index="courses", knn=knn)
  
  return [{"description": hit["_source"]["description"], "score": hit["_score"]} for hit in res.body["hits"]["hits"]]


threading.Thread(target=serve_gRPC, daemon=True).start()
