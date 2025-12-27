import {
  AttendanceStatus,
  PaymentStatus,
  PrismaClient,
} from "../generated/client";
import classTicketsJson from "../../data/enroll/classTickets.json";
import courseTicketsJson from "../../data/enroll/courseTickets.json";
import classesOnInstructorsJson from "../../data/enroll/classesOnInstructors.json";
import classesJson from "../../data/product/classes.json";
import classTemplatesJson from "../../data/product/classTemplates.json";
import courses from "../../data/product/courses.json";
import logger from "../src/utils/winston";
import { getClassesDetails } from "../src/grpc/client/productCommunication/getClassesDetails";
import { checkClass } from "../src/grpc/client/productCommunication/checkClass";

const prisma = new PrismaClient();

async function generateClassTickets() {
  let classId = 1;
  while (classId < 1000) {
    const availableStudentIds = Array.from({ length: 70 }, (_, i) =>
      String(i + 61),
    );

    const currentEnrollmentsCount = (
      await prisma.classTicket.aggregate({
        where: {
          classId,
          paymentStatus: {
            in: [
              PaymentStatus.PAID,
              PaymentStatus.PENDING,
              PaymentStatus.PART_OF_COURSE,
            ],
          },
        },
        _count: {
          studentId: true,
        },
      })
    )._count.studentId;

    const theClassData = (await getClassesDetails([classId]))
      .classesdetailsList[0];

    if (!theClassData) {
      classId++;
      continue;
    }

    const classPeopleLimit = theClassData.peopleLimit;

    const maxEnrollments = classPeopleLimit - currentEnrollmentsCount;

    const additionalEnrollmentsCount =
      Math.floor(Math.random() * maxEnrollments) + 1;

    let enrollmentIdx = 0;

    while (enrollmentIdx < additionalEnrollmentsCount) {
      const consideredStudentId =
        availableStudentIds[
          Math.min(
            Math.floor(Math.random() * availableStudentIds.length),
            availableStudentIds.length - 1,
          )
        ];

      const existingReservation = await prisma.classTicket.findFirst({
        where: {
          classId,
          studentId: consideredStudentId,
        },
      });

      if (existingReservation) continue;

      const existingStudentReservations = await prisma.classTicket.findMany({
        where: {
          studentId: consideredStudentId,
        },
      });

      const studentClassesData = (
        await getClassesDetails(
          existingStudentReservations.map((r) => r.classId),
        )
      ).classesdetailsList;

      const overlappingClass = studentClassesData.find(
        (cd) =>
          new Date(cd.startDate) <= new Date(theClassData.endDate) &&
          new Date(cd.endDate) >= new Date(theClassData.startDate),
      );

      if (overlappingClass) continue;

      const createdAt = new Date(theClassData.startDate);
      createdAt.setDate(createdAt.getDate() - 2);

      const attendanceStatus =
        new Date(theClassData.startDate) < new Date()
          ? AttendanceStatus.PRESENT
          : AttendanceStatus.ABSENT;

      await prisma.classTicket.create({
        data: {
          studentId: consideredStudentId,
          classId,
          cost: theClassData.price,
          createdAt: createdAt,
          paymentStatus: PaymentStatus.PAID,
          attendanceStatus,
          attendanceLastUpdated: new Date(theClassData.startDate),
        },
      });

      enrollmentIdx++;
    }

    classId++;
  }
}

async function main() {
  for (const classTicket of classTicketsJson) {
    const theClass = classesJson.find((c) => c.id === classTicket.classId);
    const theClassTemplate = classTemplatesJson.find(
      (ct) => ct.id === theClass?.classTemplateId,
    );
    let cost = 0;
    if (theClassTemplate && theClassTemplate.classType !== "PART_OF_COURSE")
      cost = theClassTemplate.price;

    const createdAt = new Date(theClass?.startDate || 0);
    createdAt.setDate(createdAt.getDate() - 2);
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
          createdAt,
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

    const theClasTemplates = classTemplatesJson.filter(
      (ct) => ct.courseId === courseTicket.courseId,
    );

    const theClasses = classesJson.filter((c) =>
      theClasTemplates.map((ct) => ct.id).includes(c.classTemplateId),
    );

    const courseStartDate = theClasses.reduce((acc, cur) =>
      new Date(cur.startDate || 0) < new Date(acc.startDate || 0) ? cur : acc,
    ).startDate;

    const createdAt = new Date(courseStartDate || 0);
    createdAt.setDate(createdAt.getDate() - 10);
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
          cost: theCourse?.customPrice || 0,
          createdAt,
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

  await generateClassTickets();
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
