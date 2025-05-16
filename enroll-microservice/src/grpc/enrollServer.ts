import { ProductWithEnrollService } from "../../proto/productCommunication_grpc_pb";
import logger from "../utils/winston";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { ProductWithEnrollServerImp } from "./services/productWithEnrollServer";
const PORT = 50052;
const HOST = "localhost";

export function createGrpcServer() {
  const server = new Server();
  server.addService(ProductWithEnrollService, ProductWithEnrollServerImp);
  server.bindAsync(
    `enroll-microservice:${PORT}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        logger.error(`Server error: ${err.message}`);
        return;
      }
      logger.info(`gRPC server running at http://localhost:${port}`);
    },
  );
}
