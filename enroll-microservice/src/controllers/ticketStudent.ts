import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { PaymentStatus } from "../../generated/client";

export async function getStudentTickets(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
) {
  const studentTickets = await prisma.classTicket.findMany({
    where: {
      studentId: req.user.id,
    },
  });

  const classIds = studentTickets.map((ticket) => ticket.classId);

  const classesDetails = await getClassesDetails(classIds);

  const courseIds = [
    ...new Set(classesDetails.classesdetailsList.map((cd) => cd.courseId)),
  ].filter((item) => item !== undefined);

  const coursesTickets = await prisma.courseTicket.findMany({
    where: {
      courseId: {
        in: courseIds,
      },
    },
  });

  const result = classIds.map((classId) => {
    const classDetails = classesDetails.classesdetailsList.find(
      (classDetails) => classDetails.classId === classId,
    );
    const studentTicket = studentTickets.find(
      (ticket) => ticket.classId === classId,
    );
    const courseTicket = coursesTickets.find(
      (ct) => ct.courseId === classDetails?.courseId,
    );

    let qrCodeUUID = null;
    if (
      studentTicket?.paymentStatus === PaymentStatus.PAID ||
      courseTicket?.paymentStatus === PaymentStatus.PAID
    ) {
      qrCodeUUID = studentTicket?.qrCodeUUID;
    }

    return {
      classId,
      qrCodeUUID,
      name: classDetails?.name,
      description: classDetails?.description,
      startDate: classDetails?.startDate,
      endDate: classDetails?.endDate,
      classRoomName: classDetails?.classRoomName,
      danceCategoryName: classDetails?.danceCategoryName,
      advancementLevelName: classDetails?.advancementLevelName,
      price: classDetails?.price,
      paymentStatus: studentTicket?.paymentStatus,
      coursePaymentStatus: courseTicket
        ? courseTicket?.paymentStatus
        : null,
      attendanceStatus: studentTicket?.attendanceStatus,
      attendanceLastUpdated: studentTicket?.attendanceLastUpdated,
    };
  });

  res.json({ tickets: result });
}
