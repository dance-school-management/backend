import { credentials } from "@grpc/grpc-js";
import { EnrollWithProductClient } from "../../proto/productCommunication_grpc_pb";
import "dotenv/config";

const PRODUCT_MICROSERVICE_GRPC = process.env.PRODUCT_MICROSERVICE_GRPC;

if (!PRODUCT_MICROSERVICE_GRPC) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}
export const enrollWithProductClient = new EnrollWithProductClient(
  PRODUCT_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);
