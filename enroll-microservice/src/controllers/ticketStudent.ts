import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { PaymentStatus } from "../../generated/client";
import { UniversalError } from "../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import { AttendanceStatus } from "../../generated/client";
import { stripe } from "../utils/stripe";

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
      classType: classDetails?.classType,
      classStatus: classDetails?.classStatus,
      qrCodeUUID,
      name: classDetails?.name,
      description: classDetails?.description,
      startDate: classDetails?.startDate,
      endDate: classDetails?.endDate,
      classRoomName: classDetails?.classRoomName,
      danceCategoryName: classDetails?.danceCategoryName,
      advancementLevelName: classDetails?.advancementLevelName,
      price: studentTicket?.cost || courseTicket?.cost,
      paymentStatus: studentTicket?.paymentStatus,
      coursePaymentStatus: courseTicket ? courseTicket?.paymentStatus : null,
      attendanceStatus: studentTicket?.attendanceStatus,
      attendanceLastUpdated: studentTicket?.attendanceLastUpdated,
    };
  });

  res.json({ tickets: result });
}

export async function refundTicket(
  req: Request<{}, {}, { qrCodeUUID: string }> & { user?: any },
  res: Response,
) {
  const { qrCodeUUID } = req.body;

  const theTicket = await prisma.classTicket.findFirst({
    where: {
      qrCodeUUID,
    },
  });

  if (!theTicket) {
    throw new UniversalError(StatusCodes.NOT_FOUND, "Ticket not found", [
      { field: "qrCodeUUID", message: "Not found" },
    ]);
  }

  if (theTicket.studentId !== req.user?.id) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This ticket is not owned by you",
      [],
    );
  }

  if (theTicket.paymentStatus === PaymentStatus.PENDING) {
    throw new UniversalError(StatusCodes.CONFLICT, "Ticket not paid", []);
  }

  if (theTicket.paymentStatus === PaymentStatus.REFUNDED) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Ticket already refunded",
      [],
    );
  }

  if (theTicket.attendanceStatus === AttendanceStatus.PRESENT) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You have recorded attendance on this class. The ticket cannot be refunded",
      [],
    );
  }

  const classDetails = (await getClassesDetails([theTicket.classId]))
    .classesdetailsList[0];

  if (
    classDetails.classStatus !== "POSTPONED" &&
    classDetails.classStatus !== "CANCELLED"
  ) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "You can only get a refund from a postponed or cancelled class",
      [],
    );
  }

  if (!theTicket.paymentIntentId) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Payment data required for refund was not recorded",
      [],
    );
  }

  let amount;

  if (theTicket.paymentStatus === PaymentStatus.PART_OF_COURSE)
    amount = classDetails.price;
  else if (theTicket.paymentStatus === PaymentStatus.PAID)
    amount = theTicket.cost.toNumber();
  else
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Found unknown payment status",
      [],
    );

  try {
    await stripe.refunds.create({
      payment_intent: theTicket.paymentIntentId,
      amount,
      metadata: {
        qrCodeUUID: qrCodeUUID,
      },
    });

    res.status(StatusCodes.OK).json({
      message: `Refund successful. Refunded amount: ${classDetails.price} PLN`,
    });
  } catch (error) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem with making a refund",
      [],
    );
  }
}
