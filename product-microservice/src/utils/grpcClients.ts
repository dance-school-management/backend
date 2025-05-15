import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { ProductWithEnrollClient } from "../../proto/productCommunication_grpc_pb";

const ENROLL_MICROSERVICE_GRPC = process.env.ENROLL_MICROSERVICE_GRPC;

if (!ENROLL_MICROSERVICE_GRPC) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}

export const productWithEnrollClient = new ProductWithEnrollClient(
  ENROLL_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);
