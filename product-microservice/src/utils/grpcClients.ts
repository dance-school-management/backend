import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { ProductWithEnrollClient } from "../../proto/productCommunication_grpc_pb";

const ENROLL_MICROSERVICE_GRPC_URL = process.env.ENROLL_MICROSERVICE_GRPC_URL;

if (!ENROLL_MICROSERVICE_GRPC_URL) {
  throw new Error("ENROLL_MICROSERVICE_GRPC_URL is not defined");
}

export const productWithEnrollClient = new ProductWithEnrollClient(
  ENROLL_MICROSERVICE_GRPC_URL,
  credentials.createInsecure(),
);
