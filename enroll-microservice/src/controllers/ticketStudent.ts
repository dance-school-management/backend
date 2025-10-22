import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { getCoursesDetails } from "../grpc/client/productCommunication/getCoursesDetails";
import { StatusCodes } from "http-status-codes";

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
    const classDetails = classesDetails.classesdetailsList.find(
      (classDetails) => classDetails.classId === classId,
    );
    const studentTicket = studentTickets.find(
      (ticket) => ticket.classId === classId,
    );
    return {
      classId,
      qrCodeUUID: studentTicket?.qrCodeUUID,
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
      attendaceLastUpdated: studentTicket?.attendanceLastUpdated,
    };
  });

  res.status(StatusCodes.OK).json({ tickets: result });
}

export async function getStudentCourseTickets(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
) {
  const studentCourseTickets = await prisma.courseTicket.findMany({
    where: {
      studentId: req.user.id,
    },
  });

  const courseIds = studentCourseTickets.map((sct) => sct.courseId)

  const coursesDetails = (await getCoursesDetails(courseIds)).coursesDetailsList
  
  const result = courseIds.map((courseId) => {
    const courseDetails = coursesDetails.find((cd) => cd.courseId === courseId)
    const courseTicket = studentCourseTickets.find((sct) => sct.courseId === courseId)
    return {
      courseId,
      name: courseDetails?.name,
      description: courseDetails?.description,
      danceCategoryName: courseDetails?.danceCategoryName,
      advancementLevelName: courseDetails?.advancementLevelName,
      price: Number(courseDetails?.price.toFixed(2)),
      paymentStatus: courseTicket?.paymentStatus
    }
  })

  res.status(StatusCodes.OK).json({ tickets: result });
}
