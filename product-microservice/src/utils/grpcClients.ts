import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { ProductToEnrollClient } from "../../proto/ProductToEnroll_grpc_pb";
import { ProductToProfileClient } from "../../proto/ProductToProfile_grpc_pb";

const ENROLL_MICROSERVICE_GRPC_URL = process.env.ENROLL_MICROSERVICE_GRPC_URL;
const PROFILE_MICROSERVICE_GRPC_URL = process.env.PROFILE_MICROSERVICE_GRPC_URL;

if (!ENROLL_MICROSERVICE_GRPC_URL) {
  throw new Error("ENROLL_MICROSERVICE_GRPC_URL is not defined");
}

if (!PROFILE_MICROSERVICE_GRPC_URL) {
  throw new Error("PROFILE_MICROSERVICE_GRPC_URL is not defined");
}

export const productWithEnrollClient = new ProductToEnrollClient(
  ENROLL_MICROSERVICE_GRPC_URL,
  credentials.createInsecure(),
);

export const productWithProfileClient = new ProductToProfileClient(
  PROFILE_MICROSERVICE_GRPC_URL,
  credentials.createInsecure(),
);
