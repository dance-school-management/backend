import logger from "../utils/winston";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { EnrollWithProductServerImp } from "./services/enrollWithProductServer";
import { EnrollWithProductService } from "../../proto/productCommunication_grpc_pb";
const PORT = 50051;
const HOST = "localhost";

export function createGrpcServer() {
  const server = new Server();
  server.addService(EnrollWithProductService, EnrollWithProductServerImp);
  server.bindAsync(
    `product-microservice:${PORT}`,
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
