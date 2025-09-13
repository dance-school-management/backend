import { StatusCodes } from "http-status-codes";
import { CourseIdsRequest, CoursesDetailsResponse } from "../../../../proto/EnrollToProduct_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { enrollToProductClient } from "../../../utils/grpcClients";
import logger from "../../../utils/winston";

export async function getCoursesDetails(
  courseIds: number[],
): Promise<CoursesDetailsResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CourseIdsRequest().setCourseIdsList(courseIds);
    enrollToProductClient.getCoursesDetails(
      request,
      (err: any, response: any) => {
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
      },
    );
  });
}