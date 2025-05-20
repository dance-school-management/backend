import { IEnrollWithProductServer } from "../../../proto/productCommunication_grpc_pb";
import {
  CheckClassRequest,
  CheckCourseRequest,
  CheckResponse,
} from "../../../proto/productCommunication_pb";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";

export const EnrollWithProductServerImp: IEnrollWithProductServer = {
  async checkClass(
    call: ServerUnaryCall<CheckClassRequest, CheckResponse>,
    callback: sendUnaryData<CheckResponse>,
  ): Promise<void> {
    const classId = call.request.getClassId();
    //need to add checking free slots in Class
    const classObj = await prisma.class.findFirst({
      where: {
        id: classId,
      },
    });
    if (!classObj) {
      const err = new UniversalError(
        StatusCodes.NOT_FOUND,
        `This class with id ${classId} doesn't exists`,
        [],
      );
      callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
      return;
    }
    const res = new CheckResponse().setIsValid(true);
    callback(null, res);
  },
  async checkCourse(
    call: ServerUnaryCall<CheckCourseRequest, CheckResponse>,
    callback: sendUnaryData<CheckResponse>,
  ): Promise<void> {
    const courseId = call.request.getCourseId();
    const courseObj = await prisma.course.findFirst({
      where: {
        id: courseId,
      },
    });
    if (!courseObj) {
      const err = new UniversalError(
        StatusCodes.NOT_FOUND,
        `This course with id ${courseId} doesn't exists`,
        [],
      );
      callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
      return;
    }
    const res = new CheckResponse().setIsValid(true);
    callback(null, res);
  },
};
