import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { InstructorData, InstructorsDataResponse, InstructorsIdsRequest } from "../../../../proto/EnrollToProfileMessages_pb";
import prisma from "../../../utils/prisma";
import { Role } from "../../../../generated/client";

export async function getInstructorsData(
  call: ServerUnaryCall<InstructorsIdsRequest, InstructorsDataResponse>,
  callback: sendUnaryData<InstructorsDataResponse>,
): Promise<void> {
  const instructorsIds = call.request.getInstructorsIdsList()

  const instructorsData = await prisma.profile.findMany({
    where: {
      role: Role.INSTRUCTOR,
      id: {
        in: instructorsIds
      }
    }
  })

  const instructorsDataResponse = instructorsData.map((di) => {
    const i = new InstructorData()
    i.setInstructorId(di.id)
    i.setInstructorName(di.name)
    i.setInstructorSurname(di.surname)
    return i
  })

  const res = new InstructorsDataResponse()
  res.setInstructorsDataList(instructorsDataResponse)
  callback(null, res)
}