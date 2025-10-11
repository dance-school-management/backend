import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  CourseData,
  CoursesIdsRequest,
  GetCoursesDataResponse,
} from "../../../../proto/ElasticsearchToProduct_pb";
import prisma from "../../../utils/prisma";

export async function getCoursesData(
  call: ServerUnaryCall<CoursesIdsRequest, GetCoursesDataResponse>,
  callback: sendUnaryData<GetCoursesDataResponse>,
): Promise<void> {
  const coursesIds = call.request.getCoursesIdsList();

  const coursesData = await prisma.course.findMany({
    where: {
      id: {
        in: coursesIds,
      },
    },
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
  });

  const response = new GetCoursesDataResponse();
  const coursesDataList = coursesData.map((cd) => {
    const courseData =  new CourseData()
      .setCourseId(cd.id)
      .setCourseName(cd.name)
    if (cd.danceCategory) courseData.setDanceCategoryName(cd.danceCategory.name)
    if (cd.advancementLevel) courseData.setAdvancementLevelName(cd.advancementLevel.name)
    return courseData
  });
  response.setCoursesDataList(coursesDataList);
  callback(null, response)
}
