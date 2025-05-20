import { StatusCodes } from "http-status-codes";
import {
  CheckClassRequest,
  CheckCourseRequest,
  CheckCourseResponse,
  CheckResponse,
} from "../../../proto/productCommunication_pb";
import { UniversalError } from "../../errors/UniversalError";
import { enrollWithProductClient } from "../../utils/grpcClients";
import logger from "../../utils/winston";

export async function checkClass(
  classId: number,
): Promise<CheckResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CheckClassRequest().setClassId(classId);
    enrollWithProductClient.checkClass(request, (err, response) => {
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

export async function checkCourse(
  courseId: number,
  groupNumber: number,
): Promise<CheckCourseResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CheckCourseRequest()
      .setCourseId(courseId)
      .setGroupNumber(groupNumber);
    enrollWithProductClient.checkCourse(request, (err, response) => {
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
