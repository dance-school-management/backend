import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";

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

  const result = classIds.map((classId) => {
    const classDetails = classesDetails.classesdetailsList.find((classDetails) => classDetails.classId === classId)
    const studentTicket = studentTickets.find((ticket) => ticket.classId === classId)
    return {
      classId,
      name: classDetails?.name,
      description: classDetails?.description,
      startDate: classDetails?.startDate,
      endDate: classDetails?.endDate,
      classRoomName: classDetails?.classRoomName,
      danceCategoryName: classDetails?.danceCategoryName,
      advancementLevelName: classDetails?.advancementLevelName,
      price: classDetails?.price,
      paymentStatus: studentTicket?.paymentStatus,
      attendaceStatus: studentTicket?.attendanceStatus,
      attendaceLastUpdated: studentTicket?.attendanceLastUpdated
    }
  })

  res.json({ tickets: result });
}
