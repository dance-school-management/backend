import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { ProfileToProductClient } from "../../proto/ProfileToProduct_grpc_pb";
import { ProfileToEnrollClient } from "../../proto/ProfileToEnroll_grpc_pb";

const PRODUCT_MICROSERVICE_GRPC = process.env.PRODUCT_MICROSERVICE_GRPC;
const ENROLL_MICROSERVICE_GRPC = process.env.ENROLL_MICROSERVICE_GRPC;

if (!PRODUCT_MICROSERVICE_GRPC) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}

if (!ENROLL_MICROSERVICE_GRPC) {
  throw new Error("ENROLL_MICROSERVICE_GRPC is not defined");
}

export const profileToProductClient = new ProfileToProductClient(
  PRODUCT_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);

export const profileToEnrollClient = new ProfileToEnrollClient(
  ENROLL_MICROSERVICE_GRPC,
  credentials.createInsecure()
)
