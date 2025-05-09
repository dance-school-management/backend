import { IEnrollWithProductServer } from "../../../proto/productCommunication_grpc_pb";
import {
  CheckClassRequest,
  CheckClassResponse,
} from "../../../proto/productCommunication_pb";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";

export const EnrollWithProductServerImp: IEnrollWithProductServer = {
  async checkClass(
    call: ServerUnaryCall<CheckClassRequest, CheckClassResponse>,
    callback: sendUnaryData<CheckClassResponse>,
  ): Promise<void> {
    const classId = call.request.getClassid();
    const classObj = await prisma.class.findFirst({
      where: {
        id: classId,
      },
    });
    if (!classObj) {
      const err = new UniversalError(
        StatusCodes.NOT_FOUND,
        "This class doesn't exists.",
        [],
      );
      callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
      return;
    }
    const res = new CheckClassResponse().setIsthere(true);
    callback(null, res);
  },
};
