import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../errors/UniversalError";
import { AttendanceStatus } from "../../generated/client";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { PaymentStatus } from "../../generated/client";

export async function scanTicket(
  req: Request<{}, {}, {}, { qrCodeUUID: string }> & { user?: any },
  res: Response,
) {
  const { qrCodeUUID } = req.query;

  const enrollment = await prisma.classTicket.findFirst({
    where: {
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

  const classDetails = (await getClassesDetails([enrollment.classId]))
    .classesdetailsList[0];

  if (enrollment.paymentStatus === PaymentStatus.PENDING) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Class not paid",
      ...classDetails,
    });
    return;
  }

  if (enrollment.paymentStatus === PaymentStatus.REFUNDED) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Class refunded",
      ...classDetails,
    });
    return;
  }

  if (enrollment.paymentStatus === PaymentStatus.PART_OF_COURSE) {
    if (!classDetails.courseId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Ticket invalid. This ticket is part of course and course ticket not found.",
        ...classDetails,
      });
      return;
    }

    const courseTicket = await prisma.courseTicket.findUnique({
      where: {
        studentId_courseId: {
          studentId: req.user?.id,
          courseId: classDetails.courseId,
        },
      },
    });

    if (courseTicket?.paymentStatus !== PaymentStatus.PAID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Ticket invalid. This ticket is part of course and course ticket not paid.",
        ...classDetails,
      });
      return;
    }
  }

  res.status(StatusCodes.OK).json({
    message: "Ticket valid and paid",
    attendanceStatus: enrollment.attendanceStatus,
    ...classDetails,
  });
}

export async function recordStudentAttendance(
  req: Request<
    {},
    {},
    {
      qrCodeUUID: string;
    }
  > & { user?: any },
  res: Response,
) {
  const { qrCodeUUID } = req.body;

  try {
    await prisma.classTicket.update({
      where: {
        qrCodeUUID,
      },
      data: {
        attendanceStatus: AttendanceStatus.PRESENT,
        attendanceLastUpdated: new Date(),
      },
    });
  } catch (error) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Failed to record student's attendance",
      [],
    );
  }

  res.status(StatusCodes.OK).json({ message: "Student's attendance recorded" });
}
