import { StatusCodes } from "http-status-codes";
import { InstructorIdsRequest, InstructorsClassesResponse } from "../../../../proto/ProductToEnrollMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithEnrollClient } from "../../../utils/grpcClients";

export async function getInstructorsClasses(
  instructorIds: string[],
): Promise<InstructorsClassesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new InstructorIdsRequest().setInstructorIdsList(
      instructorIds,
    );
    productWithEnrollClient.getInstructorsClasses(request, (err, response) => {
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