import { getClassesDetails } from "../grpc/client/productCommunication/getClassesDetails";
import { getCoursesDetails } from "../grpc/client/productCommunication/getCoursesDetails";
import { stripe } from "./stripe";

const SUCCESS_URL = process.env.SUCCESS_URL;

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
  studentId: string
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
      success_url: `${SUCCESS_URL}?classId=${theClass.classId}`,
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
      metadata: {
        classId,
        studentId,
        productType: 'CLASS'
      },
      expires_at: Math.floor((Date.now() + 31 * 60 * 1000) / 1000)
    },
    { idempotencyKey },
  );

  return { session, classData: theClass };
}

export async function createCourseCheckoutSession(
  courseId: number,
  studentId: string,
  groupNumber: number
) {
  const theCourse = (await getCoursesDetails([courseId])).coursesDetailsList[0];

  const idempotencyKey = `checkout-course-${studentId}-${courseId}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["blik", "p24", "card"],
      success_url: `${SUCCESS_URL}?courseId=${courseId}`,
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
      metadata: {
        groupNumber,
        courseId,
        studentId,
        productType: 'COURSE'
      },
      expires_at: Math.floor((Date.now() + 31 * 60 * 1000) / 1000)
    },
    { idempotencyKey },
  );

  return { session, courseData: theCourse };
}
