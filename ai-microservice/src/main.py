import grpc
from concurrent import futures
from src.proto import calculator_pb2_grpc, Embed_pb2_grpc
from src.grpc_service.calculator_servicer import CalculatorServicer
from src.grpc_service.embedding_service import EmbeddingServicer

PORT=50057

def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  calculator_pb2_grpc.add_CalculatorServicer_to_server(CalculatorServicer(), server)
  Embed_pb2_grpc.add_EmbedServicer_to_server(EmbeddingServicer(), server)
  server.add_insecure_port(f'[::]:{PORT}')
  server.start()
  server.wait_for_termination()

if __name__ == "__main__":
  print(f"gRPC server listening at http://localhost:{PORT}")
  serve()