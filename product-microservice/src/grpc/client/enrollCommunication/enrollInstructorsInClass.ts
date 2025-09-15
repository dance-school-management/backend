import { StatusCodes } from "http-status-codes";
import {
  EnrollInstructorsInClassRequest,
  EnrollInstructorsInClassResponse,
} from "../../../../proto/ProductToEnrollMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithEnrollClient } from "../../../utils/grpcClients";

export async function enrollInstructorsInClass(
  classId: number,
  instructorIds: string[],
): Promise<EnrollInstructorsInClassResponse.AsObject> {
  return new Promise((resolve, reject) => {
    console.log(instructorIds);
    const request = new EnrollInstructorsInClassRequest()
      .setInstructorIdsList(instructorIds)
      .setClassId(classId);
    productWithEnrollClient.enrollInstructorsInClass(
      request,
      (err: any, response: any) => {
        console.log(err);
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
      },
    );
  });
}
