import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb.js";
import {
  CourseClass,
  CourseIdsRequest,
  CoursesClassesResponse,
} from "../../../../proto/EnrollToProductMessages_pb";
import prisma from "../../../utils/prisma";

export async function getCoursesClasses(
  call: ServerUnaryCall<CourseIdsRequest, CoursesClassesResponse>,
  callback: sendUnaryData<CoursesClassesResponse>,
): Promise<void> {
  const courseIds = call.request.getCourseIdsList();

  const coursesClasses = await prisma.class.findMany({
    where: {
      classTemplate: {
        course: {
          id: {
            in: courseIds,
          },
        },
      },
    },
    include: {
      classTemplate: {
        include: {
          course: true,
        },
      },
    },
  });

  const coursesClassesIdsProtobuf = coursesClasses
    .map((courseClass) => {
      if (courseClass.classTemplate.courseId) {
        const cci = new CourseClass();
        cci.setClassId(courseClass.id);
        cci.setCourseId(courseClass.classTemplate.courseId);
        if (courseClass.classTemplate.course)
          cci.setCourseName(courseClass.classTemplate.course.name);

        const endDateProtobuf = new Timestamp()
        endDateProtobuf.setSeconds(Math.floor(courseClass.endDate.getTime() / 1000))
        cci.setClassEndDate(endDateProtobuf)

        const startDateProtobuf = new Timestamp()
        startDateProtobuf.setSeconds(Math.floor(courseClass.startDate.getTime() / 1000))
        cci.setClassStartDate(startDateProtobuf)
        return cci;
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);

  const result = new CoursesClassesResponse();
  result.setCoursesClassesList(coursesClassesIdsProtobuf);
  callback(null, result);
}
