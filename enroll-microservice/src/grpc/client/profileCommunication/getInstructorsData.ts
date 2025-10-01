import { StatusCodes } from "http-status-codes";
import { InstructorsDataResponse, InstructorsIdsRequest } from "../../../../proto/EnrollToProfileMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { enrollToProfileClient } from "../../../utils/grpcClients";
import logger from "../../../utils/winston";

export async function getInstructorsData(
  instructorsIds: string[]
): Promise<InstructorsDataResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new InstructorsIdsRequest().setInstructorsIdsList(instructorsIds)
    enrollToProfileClient.getInstructorsData(
      request,
      (err, response) => {
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
      },
    );
  });
}