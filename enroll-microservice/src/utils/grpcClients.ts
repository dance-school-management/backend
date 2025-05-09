import { credentials } from "@grpc/grpc-js";
import { EnrollWithProductClient } from "../../proto/productCommunication_grpc_pb";
import "dotenv/config";
import { CheckClassRequest, CheckClassResponse } from "../../proto/productCommunication_pb";
import { UniversalError } from "../errors/UniversalError";

const PRODUCT_MICROSERVICE_GRPC = process.env.PRODUCT_MICROSERVICE_GRPC;

if (!PRODUCT_MICROSERVICE_GRPC) {
  throw new Error("PRODUCT_MICROSERVICE_GRPC is not defined");
}
const enrollWithProductClient = new EnrollWithProductClient(
  PRODUCT_MICROSERVICE_GRPC,
  credentials.createInsecure(),
);

export async function checkClass(classId: number): Promise<CheckClassResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CheckClassRequest().setClassid(classId);
    enrollWithProductClient.checkClass(request, (err, response) => {
      if (err) {
        let unErr: UniversalError;
        try {
          const error = JSON.parse(err.details);
          unErr = new UniversalError(
            error.statusCode,
            error.message,
            error.errors,
          );
        } catch (parseError) {
          console.error("Failed to parse gRPC error details:", parseError);
          unErr = new UniversalError(500, "Internal Server Error", []);
        }
        reject(unErr);
        return;
      }
      resolve(response.toObject());
      return;
    });
  });
}
