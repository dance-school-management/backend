from src.proto import Embed_pb2_grpc
from src.proto.Embed_pb2 import EmbedRequest, EmbedResponse
from src.embedding import embed

class EmbeddingServicer(Embed_pb2_grpc.EmbedServicer):
  def Embed(self, request: EmbedRequest, context):
    return EmbedResponse(embedding=embed(text=request.text, is_query=request.is_query))