import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ClassStatus } from "../../../generated/client";
import { sendPushNotifications } from "../../rabbitmq/senders/sendPushNotifications";
import { getClassesStudents } from "../../grpc/client/enrollCommunication/getClassesStudents";
import { getClassesInstructors } from "../../grpc/client/enrollCommunication/getClassesInstructors";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../../errors/UniversalError";
import { MsgData } from "../../rabbitmq/types";

export async function cancelClass(
  req: Request<
    {},
    {},
    { classId: number; reason: string; isConfirmation: boolean }
  > & { user?: any },
  res: Response,
) {
  const { classId, reason, isConfirmation } = req.body;

  const theClass = await prisma.class.findFirst({
    where: {
      id: classId,
    },
    include: {
      classTemplate: true,
    },
  });

  if (!theClass) {
    throw new UniversalError(StatusCodes.BAD_REQUEST, "Class not found", []);
  }

  if (theClass.classStatus === ClassStatus.CANCELLED) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "This class is already cancelled.",
      [],
    );
  }

  if (theClass?.startDate < new Date() && !isConfirmation) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "You are about to cancel a class that has already started or is over.",
      [],
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.class.update({
      where: {
        id: classId,
      },
      data: {
        classStatus: ClassStatus.CANCELLED,
      },
    });

    const classStudentsIds = (
      await getClassesStudents([classId])
    ).studentsClassesIdsList.map((sc) => sc.studentId);

    const classInstructorsIds = (
      await getClassesInstructors([classId])
    ).instructorsClassesIdsList.map((ic) => ic.instructorId);

    const message: MsgData = {
      userIds: [...classStudentsIds, ...classInstructorsIds],
      title: `Cancelled class - ${theClass?.classTemplate.name}`,
      body: `Class ${theClass?.classTemplate.name} planned at ${theClass?.startDate.toDateString()} - ${theClass?.endDate.toDateString()} has been CANCELLED. Go to its ticket page to see available actions. Reason for cancellation: ${reason}`,
      payload: {
        event: "CANCELLED_CLASS",
        classId: classId,
      },
    };

    await sendPushNotifications(message);
    res.sendStatus(StatusCodes.OK);
  });
}

export async function postponeClass(
  req: Request<
    {},
    {},
    {
      classId: number;
      reason: string;
      newStartDate: Date;
      newEndDate: Date;
      isConfirmation: boolean;
    }
  > & { user?: any },
  res: Response,
) {
  const { classId, reason, newStartDate, newEndDate, isConfirmation } =
    req.body;

  const theClass = await prisma.class.findFirst({
    where: {
      id: classId,
    },
    include: {
      classTemplate: true,
    },
  });

  if (!theClass) {
    throw new UniversalError(StatusCodes.BAD_REQUEST, "Class not found", []);
  }

  if (theClass.classStatus === ClassStatus.CANCELLED && !isConfirmation) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "You are about to postpone a cancelled class. Is this what you want to do?",
      [],
    );
  }

  if (theClass?.startDate < new Date() && !isConfirmation) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "You are about to postpone a class that has already started or is over.",
      [],
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.class.update({
      where: {
        id: classId,
      },
      data: {
        classStatus: ClassStatus.POSTPONED,
        startDate: newStartDate,
        endDate: newEndDate,
      },
    });

    const classStudentsIds = (
      await getClassesStudents([classId])
    ).studentsClassesIdsList.map((sc) => sc.studentId);

    const classInstructorsIds = (
      await getClassesInstructors([classId])
    ).instructorsClassesIdsList.map((ic) => ic.instructorId);

    const message: MsgData = {
      userIds: [...classStudentsIds, ...classInstructorsIds],
      title: `Postponed class - ${theClass?.classTemplate.name}`,
      body: `Class ${theClass?.classTemplate.name} planned at ${theClass?.startDate.toDateString()} - ${theClass?.endDate.toDateString()} has been POSTPONED to ${newStartDate.toDateString()} - ${newEndDate.toDateString()}. Go to its ticket page to see available actions. Reason for postponement: ${reason}`,
      payload: {
        event: "POSTPONED_CLASS",
        classId: classId,
      },
    };

    await sendPushNotifications(message);
    res.sendStatus(StatusCodes.OK);
  });
}
