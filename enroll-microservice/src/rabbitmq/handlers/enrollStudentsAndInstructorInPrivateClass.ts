import { PaymentStatus } from "../../../generated/client";
import { getClassesDetails } from "../../grpc/client/productCommunication/getClassesDetails";
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

  const classDetails = (await getClassesDetails([classId])).classesdetailsList[0]

  await prisma.classTicket.createMany({
    data: studentIds.map((si) => ({
      classId,
      studentId: si,
      paymentStatus: PaymentStatus.PENDING,
      cost: classDetails.price,
      createdAt: new Date()
    }))
  });

  await prisma.classesOnInstructors.createMany({
    data: instructorIds.map((iid) => ({
      classId,
      instructorId: iid
    }))
  })
};
