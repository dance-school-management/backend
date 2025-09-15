import { StatusCodes } from "http-status-codes";
import { CheckClassRequest, CheckResponse } from "../../../../proto/EnrollToProductMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { enrollToProductClient } from "../../../utils/grpcClients";
import logger from "../../../utils/winston";

export async function checkClass(
  classId: number,
): Promise<CheckResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CheckClassRequest().setClassId(classId);
    enrollToProductClient.checkClass(request, (err, response) => {
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
            "Problem with accessing product data",
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