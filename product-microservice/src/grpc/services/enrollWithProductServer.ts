import { IEnrollWithProductServer } from "../../../proto/productCommunication_grpc_pb";
import {
  CheckClassRequest,
  CheckClassResponse,
} from "../../../proto/productCommunication_pb";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import prisma from "../../utils/prisma";
import { Prisma } from "../../../generated/client";

export const EnrollWithProductServerImp: IEnrollWithProductServer = {
  async checkClass(
    call: ServerUnaryCall<CheckClassRequest, CheckClassResponse>,
    callback: sendUnaryData<CheckClassResponse>,
  ): Promise<void> {
    try {
      const classId = call.request.getClassid();
      await prisma.class.findFirstOrThrow({
        where: {
          id: classId,
        },
      });
      const res = new CheckClassResponse().setIsthere(true);
      callback(null, res);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        callback({ code: status.NOT_FOUND, details: err.message });
        return;
      }
      callback({ code: status.UNKNOWN, details: "Unknown Error" });
    }
  },
};
