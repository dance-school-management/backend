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
        "description": request.class_template_description,
        "description_embedded": vector,
        "dance_category_id": request.dance_category_id,
        "advancement_level_id": request.advancement_level_id
      })
      res = esClient.index(index="courses", document=doc, refresh="wait_for")
      print(res)
      return AddClassTemplateResponse(message="Course created successfully")
    except Exception as e:
      context.abort(grpc.StatusCode.INTERNAL, f"Unexpected error: {e}")