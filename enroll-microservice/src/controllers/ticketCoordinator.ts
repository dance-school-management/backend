import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../errors/UniversalError";
import { AttendanceStatus } from "../../generated/client";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";

export async function scanTicket(
  req: Request<
    {},
    {},
    {
      classId: number;
      studentId: string;
      qrCodeUUID: string;
      isConfirmation: boolean;
    }
  > & { user?: any },
  res: Response,
) {
  const { classId, studentId, qrCodeUUID, isConfirmation } = req.body;

  const enrollment = await prisma.classTicket.findFirst({
    where: {
      classId,
      studentId,
      qrCodeUUID,
    },
  });

  if (!enrollment) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Failed to find ticket in database, this might be a fake ticket or an error occured while enrolling for the class",
      [],
    );
  }

  if (isConfirmation) {
    await prisma.classTicket.update({
      where: {
        studentId_classId: {
          studentId,
          classId,
        },
      },
      data: {
        attendanceStatus: AttendanceStatus.PRESENT,
        attendanceLastUpdated: new Date(),
      },
    });
  }

  const classDetails = await getClassesDetails([classId])

  res
    .status(StatusCodes.OK)
    .json({ message: isConfirmation ? "ATTENDANCE_RECORDED" : "TICKET_VALID", ...classDetails });
}
