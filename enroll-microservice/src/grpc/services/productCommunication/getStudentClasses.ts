import {
  GetStudentClassesRequest,
  GetStudentClassesResponse,
  StudentClass,
} from "../../../../proto/ProductToEnrollMessages_pb";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import prisma from "../../../utils/prisma";
import { PaymentStatus } from "../../../../generated/client";

export async function getStudentClasses(
  call: ServerUnaryCall<GetStudentClassesRequest, GetStudentClassesResponse>,
  callback: sendUnaryData<GetStudentClassesResponse>,
): Promise<void> {
  const studentId = call.request.getStudentId();

  const studentClasses = await prisma.classTicket.findMany({
    where: {
      studentId
    },
    select: {
      classId: true,
      studentId: true,
      paymentStatus: true
    },
  });

  const classesStudentsProtobuf: StudentClass[] = studentClasses.map((item) => {
    const sc = new StudentClass();
    sc.setClassId(item.classId);
    sc.setStudentId(item.studentId);
    sc.setPaymentStatus(item.paymentStatus)
    return sc;
  });

  const res = new GetStudentClassesResponse().setStudentClassesList(
    classesStudentsProtobuf,
  );
  callback(null, res);
}
