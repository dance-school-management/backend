import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  ClassDetails,
  ClassesDetailsResponse,
  ClassIdsRequest,
} from "../../../../proto/EnrollToProductMessages_pb";
import prisma from "../../../utils/prisma";

export async function getClassesDetails(
  call: ServerUnaryCall<ClassIdsRequest, ClassesDetailsResponse>,
  callback: sendUnaryData<ClassesDetailsResponse>,
): Promise<void> {
  const classIds = call.request.getClassIdsList();

  const classesDetails = await prisma.class.findMany({
    where: {
      id: {
        in: classIds,
      },
    },
    include: {
      classTemplate: {
        include: {
          danceCategory: true,
          advancementLevel: true,
        },
      },
      classRoom: true,
    },
  });

  const classesDetailsProtobuf = classesDetails.map((classDetails) => {
    const cbd = new ClassDetails();
    cbd
      .setClassId(classDetails.id)
      .setName(classDetails.classTemplate.name)
      .setStartDate(classDetails.startDate.toISOString())
      .setEndDate(classDetails.endDate.toISOString())
      .setClassRoomName(classDetails.classRoom.name);
    if (classDetails.classTemplate.danceCategory)
      cbd.setDanceCategoryName(classDetails.classTemplate.danceCategory.name);
    if (classDetails.classTemplate.advancementLevel)
      cbd.setAdvancementLevelName(
        classDetails.classTemplate.advancementLevel?.name,
      );
    cbd
      .setDescription(classDetails.classTemplate.description)
      .setPrice(Number(classDetails.classTemplate.price.toNumber().toFixed(2)));
    if (classDetails.classTemplate.courseId)
      cbd.setCourseId(classDetails.classTemplate.courseId);
    return cbd;
  });

  const res = new ClassesDetailsResponse();
  res.setClassesdetailsList(classesDetailsProtobuf);
  callback(null, res);
}
