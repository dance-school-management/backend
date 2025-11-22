from src.proto import calculator_pb2_grpc
from src.proto.calculator_pb2 import AddRequest, AddResponse

class CalculatorServicer(calculator_pb2_grpc.CalculatorServicer):
  def Add(self, request: AddRequest, context):
    result = request.num1 + request.num2
    return AddResponse(result=result)