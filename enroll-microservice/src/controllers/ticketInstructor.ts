import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../errors/UniversalError";
import { AttendanceStatus } from "../../generated/client";

export async function scanTicket(
  req: Request<{}, {}, { classId: number; studentId: string }> & { user?: any },
  res: Response,
) {
  const { classId, studentId } = req.body;

  const enrollment = await prisma.classTicket.findFirst({
    where: {
      classId,
      studentId,
    },
  });

  if (!enrollment) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Failed to find ticket in database, this might be a fake ticket or an error occured while enrolling fot the class",
      [],
    );
  }

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

  res.status(StatusCodes.OK).json({message: "Successfully recorded student's attendance"});
}
