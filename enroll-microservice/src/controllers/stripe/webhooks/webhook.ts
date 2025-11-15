import { Request, Response } from "express";
import prisma from "../../../utils/prisma";
import { stripe } from "../../../utils/stripe";
import { StatusCodes } from "http-status-codes";
import { UniversalError } from "../../../errors/UniversalError";
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
}
