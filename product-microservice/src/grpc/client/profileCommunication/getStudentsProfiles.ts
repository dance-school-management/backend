import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithProfileClient } from "../../../utils/grpcClients";
import logger from "../../../utils/winston";
import {
  GetStudentsProfilesRequest,
  GetStudentsProfilesResponse,
} from "../../../../proto/ProductToProfileMessages_pb";

export async function getStudentsProfiles(
  studentIds: string[],
): Promise<GetStudentsProfilesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new GetStudentsProfilesRequest().setStudentIdsList(
      studentIds,
    );
    productWithProfileClient.getStudentsProfiles(request, (err, response) => {
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
          logger.error("Failed to parse gRPC error details:", parseError);
          unErr = new UniversalError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Problem with accessing profile data",
            [],
          );
        }
        reject(unErr);
        return;
      }
      resolve(response.toObject());
      return;
    });
  });
}
