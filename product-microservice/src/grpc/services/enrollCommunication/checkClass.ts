import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  CheckClassRequest,
  CheckResponse,
} from "../../../../proto/EnrollToProductMessages_pb";
import prisma from "../../../utils/prisma";
import { ClassType } from "../../../../generated/client";
import { UniversalError } from "../../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import { ClassStatus } from "../../../../generated/client";

// Checks if a class with given id exists, if it is not cancelled or postponed 
// and returns current number of people enrolled in this class 
export async function checkClass(
  call: ServerUnaryCall<CheckClassRequest, CheckResponse>,
  callback: sendUnaryData<CheckResponse>,
): Promise<void> {

  const classId = call.request.getClassId();
  const classObj = await prisma.class.findFirst({
    where: {
      id: classId,
      classTemplate: {
        classType: {
          in: [ClassType.PRIVATE_CLASS, ClassType.THEME_PARTY],
        },
      },
    },
    include: {
      classTemplate: true
    }
  });
  if (!classObj) {
    const err = new UniversalError(
      StatusCodes.NOT_FOUND,
      `This class with id ${classId} doesn't exists or is part of a course`,
      [],
    );
    callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
    return;
  }
  if (classObj.classTemplate.courseId) {
    const err = new UniversalError(
      StatusCodes.CONFLICT,
      `This class with id ${classId} is part of course. You need to purchase the entire course.`,
      [],
    )
    callback({ code: status.UNAVAILABLE, details: JSON.stringify(err) });
    return;
  }
  if (classObj.classStatus === ClassStatus.CANCELLED || classObj.classStatus === ClassStatus.POSTPONED) {
    const err = new UniversalError(
      StatusCodes.CONFLICT,
      `This class with id ${classId} is cancelled or postponed`,
      [],
    );
    callback({ code: status.UNAVAILABLE, details: JSON.stringify(err) });
    return;
  }
  const res = new CheckResponse().setPeopleLimit(classObj.peopleLimit);
  callback(null, res);
}
