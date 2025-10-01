import { StatusCodes } from "http-status-codes";
import {
  ClassInstructorIds,
  GetSpentHoursDanceCategoriesRequest,
  GetSpentHoursDanceCategoriesResponse,
  GetSpentHoursInstructorsRequest,
  GetSpentHoursInstructorsResponse,
} from "../../../../proto/EnrollToProductMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { enrollToProductClient } from "../../../utils/grpcClients";
import logger from "../../../utils/winston";

export async function getSpentHoursDanceCategories(
  attendedClassesIds: number[],
): Promise<GetSpentHoursDanceCategoriesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request =
      new GetSpentHoursDanceCategoriesRequest().setAttendedClassesIdsList(
        attendedClassesIds,
      );
    enrollToProductClient.getSpentHoursDanceCategories(
      request,
      (err, response) => {
        if (err) {
          console.log(err);
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

export async function getSpentHoursInstructors(
  classesInstructorsIds: { classId: number; instructorId: string }[],
): Promise<GetSpentHoursInstructorsResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const requestContent = classesInstructorsIds.map((cii) => {
      const r = new ClassInstructorIds()
        .setClassId(cii.classId)
        .setInstructorId(cii.instructorId);
      return r;
    });
    const request =
      new GetSpentHoursInstructorsRequest().setClassesInstructorsIdsList(
        requestContent,
      );
    enrollToProductClient.getSpentHoursInstructors(request, (err, response) => {
      if (err) {
        console.log(err);
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
