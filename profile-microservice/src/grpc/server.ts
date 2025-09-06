import logger from "../utils/winston";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import "dotenv/config";
import { AuthToProfileServerImpl, ProductToProfileServerImpl } from "./serverImpl";
import { AuthToProfileService } from "../../proto/AuthToProfile_grpc_pb";
import { ProductToProfileService } from "../../proto/ProductToProfile_grpc_pb";
const PORT = 50051;
const HOST = "profile-microservice";
const GRPC_URL = process.env.GRPC_URL || `${HOST}:${PORT}`;

export function createGrpcServer() {
  const server = new Server();
  server.addService(ProductToProfileService, ProductToProfileServerImpl);
  server.addService(AuthToProfileService, AuthToProfileServerImpl);
  server.bindAsync(
    GRPC_URL,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        logger.error(`Server error: ${err.message}`);
        return;
      }
      logger.info(`gRPC server running at http://localhost:50052`);
    },
  );
}
