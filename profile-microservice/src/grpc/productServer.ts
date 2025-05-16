import logger from "../utils/winston";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { ProfileServiceImpl } from "./services/createProfileService";
import { ProfileService } from "../../proto/AuthCommunication_grpc_pb";
import "dotenv/config";
const PORT = 50051;
const HOST = "profile-microservice";
const GRPC_URL = process.env.GRPC_URL || `${HOST}:${PORT}`;

export function createGrpcServer() {
  const server = new Server();
  server.addService(ProfileService, ProfileServiceImpl);
  server.bindAsync(
    GRPC_URL,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        logger.error(`Server error: ${err.message}`);
        return;
      }
      logger.info(`gRPC server running at http://localhost:$50052`);
    },
  );
}
