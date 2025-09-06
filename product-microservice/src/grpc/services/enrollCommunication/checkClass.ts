import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  CheckClassRequest,
  CheckResponse,
} from "../../../../proto/Messages_pb";
import prisma from "../../../utils/prisma";
import { ClassType } from "../../../../generated/client";
import { UniversalError } from "../../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";

export async function checkClass(
  call: ServerUnaryCall<CheckClassRequest, CheckResponse>,
  callback: sendUnaryData<CheckResponse>,
): Promise<void> {
  const classId = call.request.getClassId();
  const classObj = await prisma.class.findFirst({
    where: {
      id: classId,
      classTemplate: {
        classType: {
          in: [ClassType.PRIVATE_CLASS, ClassType.THEME_PARTY],
        },
      },
    },
  });
  if (!classObj) {
    const err = new UniversalError(
      StatusCodes.NOT_FOUND,
      `This class with id ${classId} doesn't exists or is part of a course`,
      [],
    );
    callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
    return;
  }
  const res = new CheckResponse().setPeopleLimit(classObj.peopleLimit);
  callback(null, res);
}
