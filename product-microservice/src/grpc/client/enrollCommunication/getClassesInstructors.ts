import { StatusCodes } from "http-status-codes";
import { ClassIdsRequest, InstructorsClassesResponse } from "../../../../proto/ProductToEnrollMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithEnrollClient } from "../../../utils/grpcClients";

export async function getClassesInstructors(
  classIds: number[],
): Promise<InstructorsClassesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new ClassIdsRequest().setClassIdsList(classIds);
    productWithEnrollClient.getClassesInstructors(request, (err: any, response: any) => {
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
          unErr = new UniversalError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", []);
        }
        reject(unErr);
        return;
      }
      resolve(response.toObject());
      return;
    });
  });
}