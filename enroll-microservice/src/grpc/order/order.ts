import {
  CheckClassRequest,
  CheckCourseRequest,
  CheckResponse
} from "../../../proto/productCommunication_pb";
import { UniversalError } from "../../errors/UniversalError";
import { enrollWithProductClient } from "../../utils/grpcClients";

export async function checkClass(classId: number): Promise<CheckResponse.AsObject> {
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

export async function checkCourse(courseId: number): Promise<CheckResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CheckCourseRequest().setCourseId(courseId);
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
