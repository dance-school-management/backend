import src.proto.ProductToElasticsearch_pb2_grpc as ProductToElasticsearch_pb2_grpc
from src.grpc_service.services.productCommunication.add_course import add_course
from src.grpc_service.services.productCommunication.add_class_template import add_class_template

class ProductToElasticsearchServicer(ProductToElasticsearch_pb2_grpc.ProductToElasticsearchServicer):
  def AddCourse(self, request, context):
    return add_course(self, request, context)
  def AddClassTemplate(self, request, context):
    return add_class_template(self, request, context)