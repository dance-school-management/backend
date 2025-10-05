import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  CheckCourseRequest,
  CheckCourseResponse,
  CheckCourseResponseEntry,
} from "../../../../proto/EnrollToProductMessages_pb";
import prisma from "../../../utils/prisma";
import { UniversalError } from "../../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";

const DAYS_BEFORE_COURSE_START_TO_BLOCK_BUYING_TICKETS = 3;

export async function checkCourse(
  call: ServerUnaryCall<CheckCourseRequest, CheckCourseResponse>,
  callback: sendUnaryData<CheckCourseResponse>,
): Promise<void> {
  const courseId = call.request.getCourseId();
  const groupNumber = call.request.getGroupNumber();
  // const courseObj = await prisma.course.findFirst({
  //   where: {
  //     id: courseId,
  //   },
  // });

  const courseClasses = await prisma.class.findMany({
    where: {
      classTemplate: {
        courseId,
      },
    },
  });
  const firstClassStartDate = courseClasses.filter((cc) => cc.groupNumber === groupNumber).reduce(
    (acc, cur) => (cur.startDate < acc ? cur.startDate : acc),
    new Date(8640000000000000),
  );
  const date = new Date();
  const threeDaysLater = new Date(
    date.setDate(
      date.getDate() + DAYS_BEFORE_COURSE_START_TO_BLOCK_BUYING_TICKETS,
    ),
  );
  if (firstClassStartDate < threeDaysLater) {
    const err = new UniversalError(
      StatusCodes.CONFLICT,
      `It is too late to buy this course with id ${courseId}`,
      [],
    );
    callback({ code: status.UNAVAILABLE, details: JSON.stringify(err) });
    return;
  }

  const classesWithPeopleLimites = await prisma.classTemplate.findMany({
    where: {
      courseId: courseId,
    },
    select: {
      class: {
        select: {
          id: true,
          peopleLimit: true,
        },
        where: {
          groupNumber,
        },
      },
    },
  });

  if (!classesWithPeopleLimites) {
    const err = new UniversalError(
      StatusCodes.NOT_FOUND,
      `This course with id ${courseId} doesn't exists`,
      [],
    );
    callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
    return;
  }
  if (classesWithPeopleLimites.length === 0) {
    const err = new UniversalError(
      StatusCodes.NOT_FOUND,
      `This course with id ${courseId} doesn't have class_templates with group number ${groupNumber}`,
      [],
    );
    callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
  }
  // classesWithPeopleLimites.forEach((classWithPeopleLimit) => {
  //   if (classWithPeopleLimit.class.length !== 1) {
  //     const err = new UniversalError(
  //       StatusCodes.NOT_FOUND,
  //       `This course with id ${courseId} doesn't have complete set of classes with group number ${groupNumber}`,
  //       [],
  //     );
  //     callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
  //   }
  // });

  const res = new CheckCourseResponse().setPeopleLimitsList(
    classesWithPeopleLimites
      .flatMap((classWithPeopleLimit) => classWithPeopleLimit.class)
      .map((classObj) => {
        const entry = new CheckCourseResponseEntry();
        entry.setClassId(classObj.id);
        entry.setPeopleLimit(classObj.peopleLimit);
        return entry;
      }),
  );
  callback(null, res);
}
