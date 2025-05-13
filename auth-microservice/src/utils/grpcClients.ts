import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { ProfileClient } from "../../proto/AuthCommunication_grpc_pb";

const PROFILE_MICROSERVICE_GRPC_URL = process.env.PROFILE_MICROSERVICE_GRPC_URL;

if (!PROFILE_MICROSERVICE_GRPC_URL) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}

export const profileServiceClient = new ProfileClient(
  PROFILE_MICROSERVICE_GRPC_URL,
  credentials.createInsecure(),
);
