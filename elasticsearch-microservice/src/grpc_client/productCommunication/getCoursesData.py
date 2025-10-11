from typing import List
import grpc
from src.proto.ElasticsearchToProduct_pb2 import CoursesIdsRequest, GetCoursesDataResponse
from src.proto.ElasticsearchToProduct_pb2_grpc import ElasticsearchToProductStub
from src.utils.grpc_clients import PRODUCT_MICROSERVICE_GRPC

def getCoursesData(courses_ids: List[int]):
  try:
    with grpc.insecure_channel(PRODUCT_MICROSERVICE_GRPC) as channel:
      stub = ElasticsearchToProductStub(channel)
      response: GetCoursesDataResponse = stub.GetCoursesData(CoursesIdsRequest(courses_ids=courses_ids))
      return response
  except:
    raise Exception("Error occured while requesting courses data from product-microservice")