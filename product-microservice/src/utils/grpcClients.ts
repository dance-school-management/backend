import { credentials } from "@grpc/grpc-js";
import dotenv from "dotenv";
import { ProductToEnrollClient } from "../../proto/ProductToEnroll_grpc_pb";
import { ProductToProfileClient } from "../../proto/ProductToProfile_grpc_pb";
import { ProductToElasticsearchClient } from "../../proto/ProductToElasticsearch_grpc_pb";
import { EmbedClient } from "../../proto/Embed_grpc_pb";

dotenv.config({ path: ".env.development.local" });

const ENROLL_MICROSERVICE_GRPC_URL = process.env.ENROLL_MICROSERVICE_GRPC_URL;
const PROFILE_MICROSERVICE_GRPC_URL = process.env.PROFILE_MICROSERVICE_GRPC_URL;
const ELASTICSEARCH_MICROSERVICE_GRPC_URL = process.env.ELASTICSEARCH_MICROSERVICE_GRPC_URL;
const AI_MICROSERVICE_GRPC_URL = process.env.AI_MICROSERVICE_GRPC_URL;

if (!ENROLL_MICROSERVICE_GRPC_URL) {
  throw new Error("ENROLL_MICROSERVICE_GRPC_URL is not defined");
}

if (!PROFILE_MICROSERVICE_GRPC_URL) {
  throw new Error("PROFILE_MICROSERVICE_GRPC_URL is not defined");
}

if (!AI_MICROSERVICE_GRPC_URL) {
  throw new Error("AI_MICROSERVICE_GRPC_URL is not defined")
}

export const productWithEnrollClient = new ProductToEnrollClient(
  ENROLL_MICROSERVICE_GRPC_URL,
  credentials.createInsecure(),
);

export const productWithProfileClient = new ProductToProfileClient(
  PROFILE_MICROSERVICE_GRPC_URL,
  credentials.createInsecure(),
);

export const embedClient = new EmbedClient(
  AI_MICROSERVICE_GRPC_URL,
  credentials.createInsecure()
);
