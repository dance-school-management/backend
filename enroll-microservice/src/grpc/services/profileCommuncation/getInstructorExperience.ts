import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  GetInstructorExperienceRequest,
  GetInstructorExperienceResponse,
  InstructorExperience,
} from "../../../../proto/ProfileToEnrollMessages_pb";
import prisma from "../../../utils/prisma";
import { getClassesDetails } from "../../client/productCommunication/getClassesDetails";

export async function getInstructorExperience(
  call: ServerUnaryCall<
    GetInstructorExperienceRequest,
    GetInstructorExperienceResponse
  >,
  callback: sendUnaryData<GetInstructorExperienceResponse>,
): Promise<void> {
  const instructorId = call.request.getInstructorId();

  const instructorClasses = (
    await prisma.classesOnInstructors.findMany({
      where: {
        instructorId,
      },
    })
  ).map((ic) => ic.classId);

  const classesDetails = (await getClassesDetails(instructorClasses))
    .classesdetailsList;

  const instructorExperienceProtobuf = new GetInstructorExperienceResponse();

  const calculatedDanceCategoriesAndAdvancementLevels = new Set();

  const instructorExperiences = classesDetails.map((cd) => {
    if (calculatedDanceCategoriesAndAdvancementLevels.has([cd.danceCategoryName, cd.advancementLevelName].join(",")))
      return null
    const instructorExperience = new InstructorExperience();
    if (cd.danceCategoryName)
      instructorExperience.setDanceCategoryName(cd.danceCategoryName);
    if (cd.advancementLevelName)
      instructorExperience.setAdvancementLevelName(cd.advancementLevelName);
    const spentHours = classesDetails
      .filter(
        (cd2) =>
          cd.advancementLevelName === cd2.advancementLevelName &&
          cd.danceCategoryName === cd2.danceCategoryName,
      )
      .reduce(
        (acc, cur) =>
          acc +
          (new Date(cur.endDate).getTime() -
            new Date(cur.startDate).getTime()) /
            (1000 * 3600),
        0,
      );
    instructorExperience.setSpentHours(spentHours);
    calculatedDanceCategoriesAndAdvancementLevels.add([cd.danceCategoryName, cd.advancementLevelName].join(","))
    return instructorExperience
  }).filter((item) => item !== null);

  instructorExperienceProtobuf.setInstructorExperienceList(instructorExperiences)
  callback(null, instructorExperienceProtobuf)
}
