import grpc
from concurrent import futures
import src.proto.calculator_pb2 as calculator_pb2
import src.proto.calculator_pb2_grpc as calculator_pb2_grpc
import src.proto.ProductToElasticsearch_pb2_grpc as ProductToElasticsearch_pb2_grpc
import src.grpc_service.serverImpl as serverImpl

PORT = 50051

class CalculatorServicer(calculator_pb2_grpc.CalculatorServicer):
  def Add(self, request, context):
    result = request.num1 + request.num2
    return calculator_pb2.AddResponse(result=result)
  
def serve_gRPC():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  calculator_pb2_grpc.add_CalculatorServicer_to_server(CalculatorServicer(), server)
  ProductToElasticsearch_pb2_grpc.add_ProductToElasticsearchServicer_to_server(serverImpl.ProductToElasticsearchServicer(), server)
  server.add_insecure_port(f'[::]:{PORT}')
  server.start()
  print(f"gRPC server listening at http://localhost:{PORT}")
  server.wait_for_termination()