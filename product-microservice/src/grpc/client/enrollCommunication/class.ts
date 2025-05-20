import {
  ClassIdsRequest,
  EnrollInstructorsInClassRequest,
  EnrollInstructorsInClassResponse,
  GetStudentClassesRequest,
  GetStudentClassesResponse,
  InstructorIdsRequest,
  InstructorsClassesResponse,
  StudentsClassesResponse,
} from "../../../../proto/productCommunication_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithEnrollClient } from "../../../utils/grpcClients";

export async function getInstructorsClasses(
  instructorIds: string[],
): Promise<InstructorsClassesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new InstructorIdsRequest().setInstructorIdsList(
      instructorIds,
    );
    productWithEnrollClient.getInstructorsClasses(request, (err, response) => {
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
    });
  });
}

export async function getClassesInstructors(
  classIds: number[],
): Promise<InstructorsClassesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new ClassIdsRequest().setClassIdsList(classIds);
    productWithEnrollClient.getClassesInstructors(request, (err, response) => {
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
    });
  });
}

export async function enrollInstructorsInClass(
  classId: number,
  instructorIds: string[],
): Promise<EnrollInstructorsInClassResponse.AsObject> {
  return new Promise((resolve, reject) => {
    console.log(instructorIds);
    const request = new EnrollInstructorsInClassRequest()
      .setInstructorIdsList(instructorIds)
      .setClassId(classId);
    productWithEnrollClient.enrollInstructorsInClass(
      request,
      (err, response) => {
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

export async function getClassesStudents(
  classIds: number[],
): Promise<StudentsClassesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new ClassIdsRequest().setClassIdsList(classIds);
    productWithEnrollClient.getClassesStudents(request, (err, response) => {
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
    });
  });
}

export async function getStudentClasses(
  studentId: string,
): Promise<GetStudentClassesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new GetStudentClassesRequest().setStudentId(studentId);
    productWithEnrollClient.getStudentClasses(request, (err, response) => {
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
    });
  });
}
