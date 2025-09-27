import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { EnrollToProductClient } from "../../proto/EnrollToProduct_grpc_pb";
import { EnrollToProfileClient } from "../../proto/EnrollToProfile_grpc_pb";

const PRODUCT_MICROSERVICE_GRPC = process.env.PRODUCT_MICROSERVICE_GRPC;

if (!PRODUCT_MICROSERVICE_GRPC) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}

export const enrollToProductClient = new EnrollToProductClient(
  PRODUCT_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);

const PROFILE_MICROSERVICE_GRPC = process.env.PROFILE_MICROSERVICE_GRPC;

if (!PROFILE_MICROSERVICE_GRPC) {
  throw new Error("PROFILE_MICROSERVICE_GRPC is not defined");
}

export const enrollToProfileClient = new EnrollToProfileClient(
  PROFILE_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);
