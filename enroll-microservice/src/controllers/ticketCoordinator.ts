import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../errors/UniversalError";
import { AttendanceStatus } from "../../generated/client";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { PaymentStatus } from "../../generated/client";
import { stripe } from "../utils/stripe";

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
    const sessionId = enrollment.checkoutSessionId;

    if (!sessionId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "TICKET UNPAID",
        ...classDetails,
      });
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "TICKET UNPAID",
        ...classDetails,
      });
      return;
    }
  }

  if (enrollment.paymentStatus === PaymentStatus.PART_OF_COURSE) {
    const theCourse = await prisma.courseTicket.findFirst({
      where: {
        courseId: classDetails.courseId,
      },
    });

    if (!theCourse) {
      throw new UniversalError(
        StatusCodes.BAD_REQUEST,
        "Course of the class not found",
        [],
      );
    }

    if (theCourse.paymentStatus === PaymentStatus.PENDING) {
      const courseSessionId = theCourse.checkoutSessionId;

      if (!courseSessionId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "TICKET (COURSE) UNPAID",
          ...classDetails,
        });
        return;
      }

      const session = await stripe.checkout.sessions.retrieve(courseSessionId);

      if (session.payment_status !== "paid") {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "TICKET UNPAID",
          ...classDetails,
        });
        return;
      }
    }
  }

  if (enrollment.paymentStatus === PaymentStatus.REFUNDED) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "CLASS REFUNDED",
      ...classDetails,
    });
    return;
  }

  res.status(StatusCodes.OK).json({
    message: "TICKET VALID AND PAID",
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
