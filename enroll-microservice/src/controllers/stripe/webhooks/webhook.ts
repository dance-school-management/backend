import { Request, Response } from "express";
import prisma from "../../../utils/prisma";
import { stripe } from "../../../utils/stripe";
import { StatusCodes } from "http-status-codes";
import { checkClass } from "../../../grpc/client/productCommunication/checkClass";
import { UniversalError } from "../../../errors/UniversalError";
import { checkCourse } from "../../../grpc/client/productCommunication/checkCourse";
import { PaymentStatus } from "../../../../generated/client";

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
        const response = await checkClass(Number(metadata?.classId!));
        const classLimit = response.peopleLimit;
        const classCount = await prisma.classTicket.aggregate({
          where: {
            classId: Number(metadata?.classId!),
          },
          _count: {
            studentId: true,
          },
        });

        if (classCount._count.studentId >= classLimit) {
          await stripe.refunds.create({
            payment_intent: session.payment_intent as string,
            reason: "duplicate",
          });

          await prisma.classTicket.create({
            data: {
              classId: Number(metadata?.classId!),
              studentId: metadata?.studentId!,
              paymentIntentId: session.payment_intent as string,
              paymentStatus: PaymentStatus.REFUNDED,
            },
          });

          throw new UniversalError(
            StatusCodes.BAD_REQUEST,
            `Limit of people attending the class was just reached. Your ticket is cancelled and you got a refund.`,
            [],
          );
        }

        await prisma.classTicket.create({
          data: {
            classId: Number(metadata?.classId!),
            studentId: metadata?.studentId!,
            paymentIntentId: session.payment_intent as string,
            paymentStatus: PaymentStatus.PAID,
          },
        });
      } else if (metadata?.productType === "COURSE") {
        const response = await checkCourse(
          Number(metadata?.courseId!),
          Number(metadata?.groupNumber!),
        );

        const classes = response.peopleLimitsList;
        const currentTickets = await prisma.classTicket.groupBy({
          where: {
            classId: {
              in: classes.map((classObj) => classObj.classId),
            },
          },
          by: "classId",
          _count: {
            studentId: true,
          },
        });

        let limitExceeded = false;

        for (const currentTicket of currentTickets) {
          const classLimit = classes.find(
            (classObj) => classObj.classId === currentTicket.classId,
          )?.peopleLimit;
          if (classLimit && currentTicket._count.studentId >= classLimit) {
            limitExceeded = true;
            break;
          }
        }

        if (limitExceeded) {
          await stripe.refunds.create({
            payment_intent: session.payment_intent as string,
            reason: "duplicate",
          });

          await prisma.courseTicket.create({
            data: {
              courseId: Number(metadata?.courseId!),
              studentId: metadata?.studentId!,
              paymentIntentId: session.payment_intent as string,
              paymentStatus: PaymentStatus.REFUNDED,
            },
          });

          throw new UniversalError(
            StatusCodes.BAD_REQUEST,
            `Limit of people attending the course was just reached. Your ticket is cancelled and you got a refund.`,
            [],
          );
        }

        await prisma.$transaction(async (tx) => {
          await tx.courseTicket.create({
            data: {
              courseId: Number(metadata?.courseId!),
              studentId: metadata?.studentId!,
              paymentIntentId: session.payment_intent as string,
              paymentStatus: PaymentStatus.PAID,
            },
          });

          await tx.classTicket.createMany({
            data: classes.map((classObj) => ({
              classId: classObj.classId,
              studentId: metadata?.studentId!,
              paymentStatus: PaymentStatus.PART_OF_COURSE
            })),
          });
        });
      }
    }
  }
}
