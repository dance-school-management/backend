import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  InstructorData,
  MostPopularCourseIdAndInstructors,
  MostPopularCoursesIdsAndInstructorsResponse,
  MostPopularCoursesIdsRequest,
} from "../../../../proto/ProductToEnrollMessages_pb";
import prisma from "../../../utils/prisma";
import { getCoursesClasses } from "../../client/productCommunication/getCoursesClasses";
import { getInstructorsData } from "../../client/profileCommunication/getInstructorsData";

export async function getMostPopularCoursesIds(
  call: ServerUnaryCall<
    MostPopularCoursesIdsRequest,
    MostPopularCoursesIdsAndInstructorsResponse
  >,
  callback: sendUnaryData<MostPopularCoursesIdsAndInstructorsResponse>,
): Promise<void> {
  const consideredCoursesIds = call.request.getConsideredCoursesIdsList()
  const coursesTicketsCount = await prisma.courseTicket.groupBy({
    where: {
      courseId: {
        in: consideredCoursesIds
      }
    },
    by: ["courseId"],
    _count: {
      courseId: true,
    },
    orderBy: {
      _count: {
        courseId: "desc",
      },
    },
  });

  const coursesClasses = (
    await getCoursesClasses(coursesTicketsCount.map((ctc) => ctc.courseId))
  ).coursesClassesList;

  const allClasses = coursesClasses.map((cc) => cc.classId);

  const classesInstructors = await prisma.classesOnInstructors.findMany({
    where: {
      classId: {
        in: allClasses,
      },
    },
  });

  const coursesInstructors = coursesTicketsCount
    .map((ctc) => ctc.courseId)
    .map((courseId) => ({
      courseId,
      instructorIds: [
        ...new Set(
          classesInstructors
            .filter((ci) =>
              coursesClasses
                .filter((cc) => cc.courseId === courseId)
                .map((cc) => cc.classId)
                .includes(ci.classId),
            )
            .map((ci) => ci.instructorId),
        ),
      ],
    }));

  const allInstructorsIds = [
    ...new Set(coursesInstructors.flatMap((ci) => ci.instructorIds)),
  ];

  const allInstructorsData = (await getInstructorsData(allInstructorsIds))
    .instructorsDataList;

  const result = coursesTicketsCount.slice(0, 10).map((ctc) => ctc.courseId);

  const responseProtobuf = result.map((r) => {
    const courseId = r;
    const courseInstructorsIds = coursesInstructors.find(
      (ci) => ci.courseId === courseId,
    )?.instructorIds;
    const courseInstructorsData = allInstructorsData.filter((aid) =>
      courseInstructorsIds?.includes(aid.instructorId),
    );

    const courseInstructorsDataProtobuf = new MostPopularCourseIdAndInstructors();
    courseInstructorsDataProtobuf.setCourseId(courseId);
    const instructorsDataList = courseInstructorsData.map((cid) => {
      const iid = new InstructorData();
      iid.setInstructorId(cid.instructorId);
      iid.setInstructorName(cid.instructorName);
      iid.setInstructorSurname(cid.instructorSurname);
      return iid;
    });
    courseInstructorsDataProtobuf.setInstructorsDataList(instructorsDataList);
    return courseInstructorsDataProtobuf;
  });

  const response = new MostPopularCoursesIdsAndInstructorsResponse();
  response.setCoursesInstructorsList(responseProtobuf);
  callback(null, response);
}
