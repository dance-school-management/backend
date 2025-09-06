import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { Role as GrpcRole } from "../../../../proto/Messages_pb";
import prisma from "../../../utils/prisma";
import { Role as PrismaRole } from "../../../../generated/client";
import {
  FieldErrorArray,
  UniversalError,
} from "../../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../../../generated/client";
import { getWrongFields } from "../../../utils/errorHelpers";
import {
  InstructorData,
  InstructorIdsRequest,
  InstructorsDataResponse,
} from "../../../../proto/Messages_pb";

export const PrismaRoleToGrpcRole: Record<PrismaRole, GrpcRole> = {
  [PrismaRole.INSTRUCTOR]: GrpcRole.INSTRUCTOR,
  [PrismaRole.COORDINATOR]: GrpcRole.COORDINATOR,
  [PrismaRole.STUDENT]: GrpcRole.STUDENT,
  [PrismaRole.ADMINISTRATOR]: GrpcRole.ADMINISTRATOR,
};

export const GrpcRoleToPrismaRole: Record<GrpcRole, PrismaRole> = {
  [GrpcRole.INSTRUCTOR]: PrismaRole.INSTRUCTOR,
  [GrpcRole.COORDINATOR]: PrismaRole.COORDINATOR,
  [GrpcRole.STUDENT]: PrismaRole.STUDENT,
  [GrpcRole.ADMINISTRATOR]: PrismaRole.ADMINISTRATOR,
};

export async function getOtherInstructorsData(
  call: ServerUnaryCall<InstructorIdsRequest, InstructorsDataResponse>,
  callback: sendUnaryData<InstructorsDataResponse>,
): Promise<void> {
  const instructorIds = call.request.getInstructoridsList();
  try {
    const instructors = await prisma.profile.findMany({
      where: {
        role: GrpcRoleToPrismaRole[GrpcRole.INSTRUCTOR],
        id: {
          notIn: instructorIds,
        },
      },
    });
    const response = new InstructorsDataResponse();
    response.setInstructorsdataList(
      instructors.map((instructor) => {
        const instructorData = new InstructorData();
        instructorData.setId(instructor.id);
        instructorData.setName(instructor.name);
        return instructorData;
      }),
    );
    callback(null, response);
    return;
  } catch (err) {
    console.error("Error creating profile:", err);
    let fields: FieldErrorArray = [];
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      fields = getWrongFields(err);
    }
    console.log(err);
    const uniErr = new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error while creating profile",
      fields,
    );
    callback({
      code: status.INTERNAL,
      details: JSON.stringify(uniErr),
    });
  }
}
