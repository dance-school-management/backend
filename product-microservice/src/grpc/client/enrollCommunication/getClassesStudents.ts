import {
  ClassIdsRequest,
  StudentsClassesResponse,
} from "../../../../proto/Messages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithEnrollClient } from "../../../utils/grpcClients";

export async function getClassesStudents(
  classIds: number[],
): Promise<StudentsClassesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new ClassIdsRequest().setClassIdsList(classIds);
    productWithEnrollClient.getClassesStudents(
      request,
      (err: any, response: any) => {
        console.log(err);
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
      },
    );
  });
}
