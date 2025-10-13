import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import prisma from "../../../utils/prisma";
import { Role } from "../../../../generated/client";
import { InstructorData, InstructorIdsRequest, InstructorsDataResponse } from "../../../../proto/ProductToProfileMessages_pb";

export async function getInstructorsData(
  call: ServerUnaryCall<InstructorIdsRequest, InstructorsDataResponse>,
  callback: sendUnaryData<InstructorsDataResponse>,
): Promise<void> {
  const instructorsIds = call.request.getInstructorIdsList()

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
    i.setId(di.id)
    i.setName(di.name)
    i.setSurname(di.surname)
    return i
  })

  const res = new InstructorsDataResponse()
  res.setInstructorsDataList(instructorsDataResponse)
  callback(null, res)
}