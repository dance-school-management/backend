import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  CourseDetailsResponse,
  CourseIdsRequest,
  CoursesDetailsResponse,
} from "../../../../proto/EnrollToProductMessages_pb";
import prisma from "../../../utils/prisma";

export async function getCoursesDetails(
  call: ServerUnaryCall<CourseIdsRequest, CoursesDetailsResponse>,
  callback: sendUnaryData<CoursesDetailsResponse>,
): Promise<void> {
  const courseIds = call.request.getCourseIdsList();

  const coursesData = await prisma.course.findMany({
    where: {
      id: {
        in: courseIds,
      },
    },
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
  });

  const coursesDetails = await Promise.all(
    coursesData.map(async (courseData) => {
      const courseDetails = new CourseDetailsResponse();
      courseDetails
        .setCourseId(courseData.id)
        .setDescription(courseData.description)
        .setName(courseData.name)
        .setCourseStatus(courseData.courseStatus.toString())
        .setPrice(courseData.price?.toNumber() || 0);
      if (courseData.danceCategory)
        courseDetails.setDanceCategoryName(courseData.danceCategory.name);
      if (courseData.advancementLevel)
        courseDetails.setAdvancementLevelName(courseData.advancementLevel.name);

      return courseDetails;
    }),
  );

  const res = new CoursesDetailsResponse();
  res.setCoursesDetailsList(coursesDetails);

  callback(null, res);
}
