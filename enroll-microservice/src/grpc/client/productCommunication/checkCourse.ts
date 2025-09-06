import { StatusCodes } from "http-status-codes";
import { CheckCourseRequest, CheckCourseResponse } from "../../../../proto/Messages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { enrollToProductClient } from "../../../utils/grpcClients";
import logger from "../../../utils/winston";

export async function checkCourse(
  courseId: number,
  groupNumber: number,
): Promise<CheckCourseResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CheckCourseRequest()
      .setCourseId(courseId)
      .setGroupNumber(groupNumber);
    enrollToProductClient.checkCourse(request, (err: any, response: any) => {
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