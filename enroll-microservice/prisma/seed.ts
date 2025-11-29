import {
  AttendanceStatus,
  PaymentStatus,
  PrismaClient,
} from "../generated/client";
import classTicketsJson from "../../data/enroll/classTickets.json";
import courseTicketsJson from "../../data/enroll/courseTickets.json";
import classesOnInstructorsJson from "../../data/enroll/classesOnInstructors.json";
import classes from "../../data/product/classes.json";
import classTemplates from "../../data/product/classTemplates.json";
import courses from "../../data/product/courses.json";
import logger from "../src/utils/winston";

const prisma = new PrismaClient();

async function main() {
  for (const classTicket of classTicketsJson) {
    const theClass = classes.find((c) => c.id === classTicket.classId);
    const theClassTemplate = classTemplates.find(
      (ct) => ct.id === theClass?.classTemplateId,
    );
    let cost = 0;
    if (theClassTemplate && theClassTemplate.classType !== "PART_OF_COURSE")
      cost = theClassTemplate.price;
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
          studentId: classTicket.studentId,
          classId: classTicket.classId,
          paymentStatus: classTicket.paymentStatus as PaymentStatus,
          attendanceLastUpdated: classTicket.attendanceLastUpdated,
          attendanceStatus: classTicket.attendanceStatus as AttendanceStatus,
          cost,
        },
      });
    } catch (error: any) {
      logger.error(
        `Error upserting classTicket with studentId ${classTicket.studentId} and classId ${classTicket.classId} \n error: ${error}`,
      );
    }
  }

  for (const courseTicket of courseTicketsJson) {
    const theCourse = courses.find((c) => c.id === courseTicket.courseId);
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
          studentId: courseTicket.studentId,
          courseId: courseTicket.courseId,
          paymentStatus: courseTicket.paymentStatus as PaymentStatus,
          paymentIntentId: courseTicket.paymentIntentId,
          cost: theCourse?.customPrice || 0
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
