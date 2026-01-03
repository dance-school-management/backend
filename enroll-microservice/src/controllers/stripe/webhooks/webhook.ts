import { Request, Response } from "express";
import prisma from "../../../utils/prisma";
import { stripe } from "../../../utils/stripe";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../../../errors/UniversalError";
import { PaymentStatus } from "../../../../generated/client";
import { getCoursesClasses } from "../../../grpc/client/productCommunication/getCoursesClasses";
import { getClassesDetails } from "../../../grpc/client/productCommunication/getClassesDetails";
import Stripe from "stripe";

export async function handleWebhook(req: Request, res: Response) {
  console.log("webhook has been hit");

  const sig = req.headers["stripe-signature"];

  if (!sig) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Stripe signature missing in request",
      [],
    );
  }

  let event;

  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeWebhookSecret) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Stripe webhook secret not provided",
      [],
    );
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed: ", err.message);
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;
    if (session.payment_status === "paid") {
      if (metadata?.productType === "CLASS") {
        await prisma.classTicket.update({
          where: {
            studentId_classId: {
              classId: Number(metadata.classId!),
              studentId: metadata.studentId!,
            },
          },
          data: {
            paymentIntentId: session.payment_intent as string,
            paymentStatus: PaymentStatus.PAID,
          },
        });
      } else if (metadata?.productType === "COURSE") {
        await prisma.courseTicket.update({
          where: {
            studentId_courseId: {
              studentId: metadata.studentId!,
              courseId: Number(metadata.courseId!),
            },
          },
          data: {
            paymentIntentId: session.payment_intent as string,
            paymentStatus: PaymentStatus.PAID,
          },
        });
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;

    const potentialClassTicket = await prisma.classTicket.findFirst({
      where: {
        checkoutSessionId: session.id,
      },
    });

    if (potentialClassTicket) {
      const classType = (
        await getClassesDetails([potentialClassTicket.classId])
      ).classesdetailsList[0].classType;

      if (classType === "PRIVATE_CLASS") {
        res.sendStatus(200);
        return;
      }

      if (potentialClassTicket.paymentStatus === PaymentStatus.PENDING) {
        await prisma.classTicket.delete({
          where: {
            checkoutSessionId: session.id,
          },
        });
      }
    }

    const potentialCourseTicket = await prisma.courseTicket.findFirst({
      where: {
        checkoutSessionId: session.id,
      },
    });

    if (potentialCourseTicket) {
      if (potentialCourseTicket.paymentStatus === PaymentStatus.PENDING) {
        const courseClassesIds = (
          await getCoursesClasses([potentialCourseTicket.courseId])
        ).coursesClassesList.map((cc) => cc.classId);

        await prisma.$transaction(async (tx) => {
          await tx.courseTicket.delete({
            where: {
              checkoutSessionId: session.id,
            },
          });

          await tx.classTicket.deleteMany({
            where: {
              classId: {
                in: courseClassesIds,
              },
            },
          });
        });
      }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    const paymentIntentId =
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id;

    if (!paymentIntentId) {
      // You can log and exit; no way to map this charge to your ticket
      return;
    }

    await prisma.classTicket.update({
      where: { paymentIntentId },
      data: { paymentStatus: PaymentStatus.REFUNDED },
    });
  }
  res.sendStatus(StatusCodes.OK);
}
