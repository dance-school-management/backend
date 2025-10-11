from src.elastic import esClient
from src.proto.ProductToElasticsearch_pb2 import AddClassTemplateRequest, AddClassTemplateResponse
from src.model import embed
import json
import grpc

def add_class_template(self, request: AddClassTemplateRequest, context):
    try:
      vector = embed(request.class_template_description, is_query=False)

      doc = json.dumps({
        "id": request.class_template_id,
        "name": request.class_template_name,
        "description": request.class_template_description,
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
      return AddClassTemplateResponse(message="Course created successfully")
    except Exception as e:
      context.abort(grpc.StatusCode.INTERNAL, f"Unexpected error: {e}")