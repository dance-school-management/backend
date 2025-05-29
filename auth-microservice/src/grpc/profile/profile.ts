import { UniversalError } from "../../errors/UniversalError";
import { profileServiceClient } from "../../utils/grpcClients";
import {
  CreateProfileRequest,
  CreateProfileResponse,
  Role as GrpcRole,
} from "../../../proto/AuthCommunication_pb";
import { Role as PrismaRole } from "../../../generated/client";
import logger from "../../utils/winston";

export const StringRoleToGrpcRole: Record<string, GrpcRole> = {
  [PrismaRole.INSTRUCTOR]: GrpcRole.INSTRUCTOR,
  [PrismaRole.COORDINATOR]: GrpcRole.COORDINATOR,
  [PrismaRole.STUDENT]: GrpcRole.STUDENT,
  [PrismaRole.ADMINISTRATOR]: GrpcRole.ADMINISTRATOR,
};

export async function createProfile(
  id: string,
  name: string,
  surname: string,
  role: string,
): Promise<CreateProfileResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new CreateProfileRequest()
      .setId(id)
      .setName(name)
      .setSurname(surname)
      .setRole(StringRoleToGrpcRole[role]);

    profileServiceClient.createProfile(request, (err, response) => {
      if (err) {
        let unErr: UniversalError;
        try {
          const error = JSON.parse(err.details);
          unErr = new UniversalError(
            error.statusCode,
            error.message,
            error.errors,
          );
        } catch (parseError) {
          console.error("Failed to parse gRPC error details:", parseError);
          logger.error(err);
          unErr = new UniversalError(500, "Internal Server Error", []);
        }
        reject(unErr);
        return;
      }
      resolve(response.toObject());
      return;
    });
  });
}
