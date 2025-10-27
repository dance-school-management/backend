import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { getCoursesDetails } from "../grpc/client/productCommunication/getCoursesDetails";
import prisma from "./prisma";
import { stripe } from "./stripe";

export function convertDateToReadable(date: Date) {
  return date.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function createClassCheckoutSession(
  classId: number,
  studentId: string,
) {
  const theClass = (await getClassesDetails([classId])).classesdetailsList[0];

  const startDate = new Date(theClass.startDate);
  const endDate = new Date(theClass.endDate);
  const price = theClass.price;

  const idempotencyKey = `checkout-class-${studentId}-${classId}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["blik", "p24", "card"],
      success_url: "http://localhost:3000/payment/success",
      line_items: [
        {
          price_data: {
            product_data: {
              name: theClass.name,
              description:
                `start date: ${convertDateToReadable(startDate)} | ` +
                `end date: ${convertDateToReadable(endDate)} | ` +
                `dance category: ${theClass.danceCategoryName ?? "not provided"} | ` +
                `advancement level: ${theClass.advancementLevelName ?? "not provided"} | ` +
                `class description: ${theClass.description}`,
            },
            unit_amount: price * 100,
            currency: "pln",
          },
          quantity: 1,
        },
      ],
    },
    { idempotencyKey },
  );

  await prisma.classTicket.update({
    where: {
      studentId_classId: {
        studentId,
        classId,
      },
    },
    data: {
      checkoutSessionId: session.id,
    },
  });

  return session;
}

export async function createCourseCheckoutSession(
  courseId: number,
  studentId: string,
) {
  const theCourse = (await getCoursesDetails([courseId])).coursesDetailsList[0];

  const idempotencyKey = `checkout-course-${studentId}-${courseId}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["blik", "p24", "card"],
      success_url: "http://localhost:3000/payment/success",
      line_items: [
        {
          price_data: {
            product_data: {
              name: theCourse.name,
              description:
                `dance category: ${theCourse.danceCategoryName ?? "not provided"} | ` +
                `advancement level: ${theCourse.advancementLevelName ?? "not provided"} | ` +
                `course description: ${theCourse.description}`,
            },
            unit_amount: Number((theCourse.price * 100).toFixed(2)),
            currency: "pln",
          },
          quantity: 1,
        },
      ],
    },
    { idempotencyKey },
  );

  await prisma.courseTicket.update({
    where: {
      studentId_courseId: {
        courseId,
        studentId,
      },
    },
    data: {
      checkoutSessionId: session.id,
    },
  });

  return session
}
