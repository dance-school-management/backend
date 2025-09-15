import logger from "../utils/winston";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { ProductToEnrollServerImp } from "./serverImpl";
import { ProductToEnrollService } from "../../proto/ProductToEnroll_grpc_pb";

const PORT = 50051;
const HOST = "enroll-microservice";
const GRPC_URL = process.env.GRPC_URL || `${HOST}:${PORT}`;

export function createGrpcServer() {
  const server = new Server();
  server.addService(ProductToEnrollService, ProductToEnrollServerImp);
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
