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
        "description": request.course_description,
        "description_embedded": vector,
        "dance_category_id": request.dance_category_id,
        "advancement_level_id": request.advancement_level_id
      })
      res = esClient.index(index="courses", document=doc, refresh="wait_for")
      print(res)
      return AddCourseResponse(message="Course created successfully")
    except Exception as e:
      context.abort(grpc.StatusCode.INTERNAL, f"Unexpected error: {e}")