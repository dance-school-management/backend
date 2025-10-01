import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { CourseIdsRequest, DanceCategoriesOfCoursesResponse, DanceCategoryOfCourse } from "../../../../proto/EnrollToProductMessages_pb";
import prisma from "../../../utils/prisma";

export async function getDanceCategoriesOfCourses(
  call: ServerUnaryCall<CourseIdsRequest, DanceCategoriesOfCoursesResponse>,
  callback: sendUnaryData<DanceCategoriesOfCoursesResponse>,
): Promise<void> {
  const finishedCoursesIds = call.request.getCourseIdsList()

  const finishedCoursesData = await prisma.course.findMany({
    where: {
      id: {
        in: finishedCoursesIds
      }
    },
    include: {
      danceCategory: true,
      advancementLevel: true
    }
  })

  const responseProtobuf = finishedCoursesData.map((finishedCourseData) => {
    const dcoc = new DanceCategoryOfCourse()
    dcoc.setCourseId(finishedCourseData.id)
    if (finishedCourseData.danceCategoryId && finishedCourseData.danceCategory) {
      dcoc.setDanceCategoryId(finishedCourseData.danceCategoryId)
      dcoc.setDanceCategoryName(finishedCourseData.danceCategory?.name)
    }
    if (finishedCourseData.advancementLevelId && finishedCourseData.advancementLevel) {
      dcoc.setAdvancementLevelId(finishedCourseData.advancementLevelId)
      dcoc.setAdvancementLevelName(finishedCourseData.advancementLevel.name)
    }
    return dcoc
  })

  const res = new DanceCategoriesOfCoursesResponse()
  res.setDanceCategoriesOfCoursesList(responseProtobuf)

  callback(null, res)
}