import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { IProfileServer } from "../../../proto/AuthCommunication_grpc_pb";
import {
  CreateProfileRequest,
  CreateProfileResponse,
  Role as GrpcRole,
} from "../../../proto/AuthCommunication_pb";
import prisma from "../../utils/prisma";
import { Role as PrismaRole } from "../../../generated/client";
import { FieldErrorArray, UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../../generated/client";
import { getWrongFields } from "../../utils/errorHelpers";

export const PrismaRoleToGrpcRole: Record<PrismaRole, GrpcRole> = {
  [PrismaRole.INSTRUCTOR]: GrpcRole.INSTRUCTOR,
  [PrismaRole.COORDINATOR]: GrpcRole.COORDINATOR,
  [PrismaRole.STUDENT]: GrpcRole.STUDENT,
};

export const GrpcRoleToPrismaRole: Record<GrpcRole, PrismaRole> = {
  [GrpcRole.INSTRUCTOR]: PrismaRole.INSTRUCTOR,
  [GrpcRole.COORDINATOR]: PrismaRole.COORDINATOR,
  [GrpcRole.STUDENT]: PrismaRole.STUDENT,
};

export const ProfileServiceImpl: IProfileServer = {
  createProfile: async function (
    call: ServerUnaryCall<CreateProfileRequest, CreateProfileResponse>,
    callback: sendUnaryData<CreateProfileResponse>,
  ): Promise<void> {
    const { id, name, surname, role } = call.request.toObject();
    try {
      await prisma.profile.create({
        data: {
          id,
          name,
          surname,
          role: GrpcRoleToPrismaRole[role],
        },
      });
      const response = new CreateProfileResponse();
      response.setIsValid(true);
      callback(null, response);
      return;
    } catch (err) {
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
  },
};
