import { GetStudentClassesRequest, InstructorIdsRequest, InstructorsDataResponse } from "../../../../proto/productCommunication_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithProfileClient } from "../../../utils/grpcClients";

export async function getOtherInstructorsData(
  instructorIds: string[],
): Promise<InstructorsDataResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new InstructorIdsRequest().setInstructorIdsList(instructorIds)
    productWithProfileClient.getOtherInstructorsData(request, (err, response) => {
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