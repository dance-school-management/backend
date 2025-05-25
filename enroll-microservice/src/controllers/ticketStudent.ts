import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getClassesDetails } from "../grpc/ticket/ticket";

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

  res.json({ tickets: classesDetails.classesdetailsList });
}
