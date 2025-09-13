import {
  AttendanceStatus,
  PaymentStatus,
  PrismaClient,
} from "../generated/client";
import classTicketsJson from "../../data/enroll/classTickets.json";
import courseTicketsJson from "../../data/enroll/courseTickets.json";
import classesOnInstructorsJson from "../../data/enroll/classesOnInstructors.json";
import logger from "../src/utils/winston";

const prisma = new PrismaClient();

async function main() {
  for (const classTicket of classTicketsJson) {
    try {
      await prisma.classTicket.upsert({
        where: {
          studentId_classId: {
            studentId: classTicket.studentId,
            classId: classTicket.classId,
          },
        },
        update: {},
        create: {
          checkoutSessionId: classTicket.checkoutSessionId,
          studentId: classTicket.studentId,
          classId: classTicket.classId,
          isConfirmed: classTicket.isConfirmed,
          paymentStatus: classTicket.paymentStatus as PaymentStatus,
          attendanceLastUpdated: classTicket.attendanceLastUpdated,
          attendanceStatus: classTicket.attendanceStatus as AttendanceStatus,
        },
      });
    } catch (error: any) {
      logger.error(
        `Error upserting classTicket with studentId ${classTicket.studentId} and classId ${classTicket.classId} \n error: ${error}`,
      );
    }
  }

  for (const courseTicket of courseTicketsJson) {
    try {
      await prisma.courseTicket.upsert({
        where: {
          studentId_courseId: {
            studentId: courseTicket.studentId,
            courseId: courseTicket.courseId,
          },
        },
        update: {},
        create: {
          checkoutSessionId: courseTicket.checkoutSessionId,
          studentId: courseTicket.studentId,
          courseId: courseTicket.courseId,
          paymentStatus: courseTicket.paymentStatus as PaymentStatus,
        },
      });
    } catch (error: any) {
      logger.error(
        `Error upserting courseTicket with studentId ${courseTicket.studentId} and courseId ${courseTicket.courseId} \n error: ${error}`,
      );
    }
  }

  for (const classOnInstructor of classesOnInstructorsJson) {
    try {
      await prisma.classesOnInstructors.upsert({
        where: {
          instructorId_classId: {
            instructorId: classOnInstructor.instructorId,
            classId: classOnInstructor.classId,
          },
        },
        update: {},
        create: {
          instructorId: classOnInstructor.instructorId,
          classId: classOnInstructor.classId,
        },
      });
    } catch (error: any) {
      logger.error(
        `Error upserting classOnInstructor with classId ${classOnInstructor.classId} and instructorId ${classOnInstructor.instructorId} \n error: ${error}`,
      );
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
