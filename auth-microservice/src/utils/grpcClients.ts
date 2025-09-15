import { credentials } from "@grpc/grpc-js";
import "dotenv/config";
import { AuthToProfileClient } from "../../proto/AuthToProfile_grpc_pb";

const PROFILE_MICROSERVICE_GRPC_URL = process.env.PROFILE_MICROSERVICE_GRPC_URL;

if (!PROFILE_MICROSERVICE_GRPC_URL) {
  throw new Error("PROFILE_MICROSERVICE_GRPC_URL is not defined");
}

export const profileServiceClient = new AuthToProfileClient(
  PROFILE_MICROSERVICE_GRPC_URL,
  credentials.createInsecure(),
);
