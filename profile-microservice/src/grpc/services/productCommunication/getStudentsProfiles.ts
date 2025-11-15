import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { GetStudentsProfilesRequest, GetStudentsProfilesResponse, StudentProfile } from "../../../../proto/ProductToProfileMessages_pb";
import prisma from "../../../utils/prisma";
import { Role } from "../../../../generated/client";

export async function getStudentsProfiles(
  call: ServerUnaryCall<GetStudentsProfilesRequest, GetStudentsProfilesResponse>,
  callback: sendUnaryData<GetStudentsProfilesResponse>,
): Promise<void> {
  const studentIds = call.request.getStudentIdsList()

  const studentsProfiles = await prisma.profile.findMany({
    where: {
      id: {
        in: studentIds
      },
      role: Role.STUDENT
    }
  })

  const result = new GetStudentsProfilesResponse()
  const studentsProfilesProtobuf = studentsProfiles.map((sp) => {
    return new StudentProfile().setFirstName(sp.name).setLastName(sp.surname)
  })
  result.setStudentProfilesList(studentsProfilesProtobuf)
  callback(null, result)
}