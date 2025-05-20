import { ProductWithEnrollService } from "../../proto/productCommunication_grpc_pb";
import logger from "../utils/winston";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { ProductWithEnrollServerImp } from "./services/productWithEnrollServer";
const PORT = 50051;
const HOST = "enroll-microservice";
const GRPC_URL = process.env.GRPC_URL || `${HOST}:${PORT}`;

export function createGrpcServer() {
  const server = new Server();
  server.addService(ProductWithEnrollService, ProductWithEnrollServerImp);
  server.bindAsync(
    GRPC_URL,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        logger.error(`Server error: ${err.message}`);
        return;
      }
      logger.info(`gRPC server running at http://localhost:50053`);
    },
  );
}
