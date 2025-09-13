import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  CourseDetailsResponse,
  CourseIdsRequest,
  CoursesDetailsResponse,
} from "../../../../proto/EnrollToProduct_pb";
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

  const coursesDetails = await Promise.all(coursesData.map(async (courseData) => {
    let price;
    if (courseData.customPrice)
      price = Number(courseData.customPrice.toFixed(2));
    else {
      const allCourseClasses = await prisma.class.findMany({
        where: {
          classTemplate: {
            courseId: courseData.id,
          },
        },
        include: {
          classTemplate: true,
        },
      });
      price = Number(
        allCourseClasses
          .reduce((acc, cur) => acc + cur.classTemplate.price.toNumber(), 0)
          .toFixed(2),
      );
    }

    const courseDetails = new CourseDetailsResponse();
    courseDetails.setCourseId(courseData.id);
    courseDetails.setDescription(courseData.description);
    courseDetails.setName(courseData.name);
    courseDetails.setCourseStatus(courseData.courseStatus.toString());
    if (courseData.danceCategory)
      courseDetails.setDanceCategoryName(courseData.danceCategory.name);
    if (courseData.advancementLevel)
      courseDetails.setAdvancementLevelName(courseData.advancementLevel.name);
    courseDetails.setPrice(price);

    return courseDetails;
  }));

  const res = new CoursesDetailsResponse();
  res.setCoursesDetailsList(coursesDetails);

  callback(null, res)
}
