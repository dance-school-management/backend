import { credentials } from "@grpc/grpc-js";
import { EnrollWithProductClient } from "../../proto/productCommunication_grpc_pb";
import "dotenv/config";
import { CheckClassRequest } from "../../proto/productCommunication_pb";

const PRODUCT_MICROSERVICE_GRPC = process.env.PRODUCT_MICROSERVICE_GRPC;

if (!PRODUCT_MICROSERVICE_GRPC) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}
const enrollWithProductClient = new EnrollWithProductClient(
  PRODUCT_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);

export async function checkClass(classId: number) {
  return new Promise((resolve, reject) => {
    const request = new CheckClassRequest().setClassid(classId);
    enrollWithProductClient.checkClass(request, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response.toObject());
    });
  });
}
