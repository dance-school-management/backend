import {
  GetInstructorExperienceRequest,
  GetInstructorExperienceResponse,
} from "../../../../proto/ProfileToEnrollMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { profileToEnrollClient } from "../../../utils/grpcClients";

export async function getInstructorExperience(
  instructorId: string,
  dateFrom: string,
  dateTo: string,
): Promise<GetInstructorExperienceResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new GetInstructorExperienceRequest()
      .setInstructorId(instructorId)
      .setDateFrom(dateFrom)
      .setDateTo(dateTo);
    profileToEnrollClient.getInstructorExperience(request, (err, response) => {
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
