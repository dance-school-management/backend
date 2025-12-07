import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import prisma from "../../../utils/prisma";
import {
  EnrollInstructorsInClassRequest,
  EnrollInstructorsInClassResponse,
} from "../../../../proto/ProductToEnrollMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";

export async function enrollInstructorsInClass(
  call: ServerUnaryCall<
    EnrollInstructorsInClassRequest,
    EnrollInstructorsInClassResponse
  >,
  callback: sendUnaryData<EnrollInstructorsInClassResponse>,
): Promise<void> {
  const classId = call.request.getClassId();
  const instructorIds = call.request.getInstructorIdsList();
  try {
    await prisma.classesOnInstructors.deleteMany({
      where: {
        classId,
      },
    });
    await prisma.classesOnInstructors.createMany({
      data: instructorIds.map((instructorId) => ({
        classId,
        instructorId,
      })),
    });
  } catch (err) {
    const unErr = new UniversalError(
      StatusCodes.NOT_FOUND,
      "Error occured while creating classes-instructor enrollments",
      [],
    );
    callback({ code: status.NOT_FOUND, details: JSON.stringify(unErr) });
    return;
  }

  const res = new EnrollInstructorsInClassResponse().setSuccess(true);
  callback(null, res);
}
