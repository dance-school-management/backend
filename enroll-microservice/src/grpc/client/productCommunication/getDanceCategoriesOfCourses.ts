import { StatusCodes } from "http-status-codes";
import { CourseIdsRequest, CoursesClassesIdsResponse, CoursesDetailsResponse, DanceCategoriesOfCoursesResponse } from "../../../../proto/EnrollToProductMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { enrollToProductClient } from "../../../utils/grpcClients";
import logger from "../../../utils/winston";

export async function getDanceCategoriesOfCourses(
  courseIds: number[],
): Promise<DanceCategoriesOfCoursesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CourseIdsRequest().setCourseIdsList(courseIds);
    enrollToProductClient.getDanceCategoriesOfCourses(
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