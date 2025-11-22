import { PaymentStatus } from "../../../generated/client";
import prisma from "../../utils/prisma";
import { EnrollStudentsAndInstructorInPrivateClassMsgData } from "../types";

export const EnrollStudentsAndInstructorInPrivateClass = async (
  msg: string,
) => {
  const msgData: EnrollStudentsAndInstructorInPrivateClassMsgData =
    JSON.parse(msg);

  const classId = msgData.classId;
  const studentIds = msgData.studentIds;
  const instructorIds = msgData.instructorIds;

  await prisma.classTicket.createMany({
    data: studentIds.map((si) => ({
      classId,
      studentId: si,
      paymentStatus: PaymentStatus.PENDING
    }))
  });

  await prisma.classesOnInstructors.createMany({
    data: instructorIds.map((iid) => ({
      classId,
      instructorId: iid
    }))
  })
};
