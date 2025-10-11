from src.elastic import esClient
from src.proto.ProductToElasticsearch_pb2 import AddCourseRequest, AddCourseResponse
from src.model import embed
import json
import grpc

def add_course(self, request: AddCourseRequest, context):
    try:
      vector = embed(request.course_description, is_query=False)

      doc = json.dumps({
        "id": request.course_id,
        "name": request.course_name,
        "description": request.course_description,
        "description_embedded": vector,
        "dance_category": {
          "id": request.dance_category.id,
          "name": request.dance_category.name,
          "description": request.dance_category.description 
        },
        "advancement_level": {
           "id": request.advancement_level.id,
           "name": request.advancement_level.name,
           "description": request.advancement_level.description
        },
        "price": request.price
      })
      res = esClient.index(index="courses", document=doc, refresh="wait_for")
      print(res)
      return AddCourseResponse(message="Course created successfully")
    except Exception as e:
      context.abort(grpc.StatusCode.INTERNAL, f"Unexpected error: {e}")