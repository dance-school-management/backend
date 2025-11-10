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

const DAYS_BEFORE_COURSE_START_TO_BLOCK_BUYING_TICKETS = 3;

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
    },
    include: {
      classTemplate: true,
    },
  });
  if (!classObj) {
    const err = new UniversalError(
      StatusCodes.NOT_FOUND,
      `This class with id ${classId} doesn't exist`,
      [],
    );
    callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
    return;
  }
  if (classObj.startDate < new Date()) {
    const err = new UniversalError(
      StatusCodes.NOT_FOUND,
      `It is too late to buy ticket on this class with id ${classId}`,
      [],
    );
    callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
    return;
  }

  if (classObj.classTemplate.courseId) {
    const courseClasses = await prisma.class.findMany({
      where: {
        classTemplate: {
          courseId: classObj.classTemplate.courseId,
        },
      },
    });
    const firstClassStartDate = courseClasses
      .filter((cc) => cc.groupNumber === classObj.groupNumber)
      .reduce(
        (acc, cur) => (cur.startDate < acc ? cur.startDate : acc),
        // Biggest date possible
        new Date(8640000000000000),
      );
    const date = new Date();
    const threeDaysLater = new Date(
      date.setDate(
        date.getDate() + DAYS_BEFORE_COURSE_START_TO_BLOCK_BUYING_TICKETS,
      ),
    );
    if (firstClassStartDate > threeDaysLater) {
      const err = new UniversalError(
        StatusCodes.CONFLICT,
        `This class with id ${classId} is part of course and it is too early. 
        You need to purchase the entire course or wait until 3 days before the course starts.`,
        [],
      );
      callback({ code: status.UNAVAILABLE, details: JSON.stringify(err) });
      return;
    }
  }
  if (
    classObj.classStatus === ClassStatus.CANCELLED
  ) {
    const err = new UniversalError(
      StatusCodes.CONFLICT,
      `This class with id ${classId} is cancelled`,
      [],
    );
    callback({ code: status.UNAVAILABLE, details: JSON.stringify(err) });
    return;
  }
  const res = new CheckResponse().setPeopleLimit(classObj.peopleLimit);
  callback(null, res);
}
