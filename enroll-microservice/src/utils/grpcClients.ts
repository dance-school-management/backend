import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { EnrollToProductClient } from "../../proto/EnrollToProduct_grpc_pb";

const PRODUCT_MICROSERVICE_GRPC = process.env.PRODUCT_MICROSERVICE_GRPC;

if (!PRODUCT_MICROSERVICE_GRPC) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}
export const enrollToProductClient = new EnrollToProductClient(
  PRODUCT_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);
