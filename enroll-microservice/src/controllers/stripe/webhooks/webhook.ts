import { Request, Response } from "express";
import { PaymentStatus } from "../../../../generated/client";
import prisma from "../../../utils/prisma";
import { stripe } from "../../../utils/stripe";
import { StatusCodes } from "http-status-codes";

export async function handleWebhook(req: Request, res: Response) {
  console.log("webhook has been hit");

  const sig = req.headers["stripe-signature"];

  if (!sig) {
    throw new Error("Stripe signature missing in request");
  }

  let event;

  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeWebhookSecret) {
    throw new Error("Stripe webhook secret not provided");
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed: ", err.message);
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout completed: ", session.id, session.payment_status);
    if (session.payment_status === "paid") {
      const theClassTicket = await prisma.classTicket.findFirst({
        where: {
          checkoutSessionId: session.id,
        },
      });

      if (theClassTicket) {
        await prisma.classTicket.update({
          where: {
            checkoutSessionId: session.id,
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
          },
        });
      }

      const theCourseTicket = await prisma.courseTicket.findFirst({
        where: {
          checkoutSessionId: session.id,
        },
      });

      if (theCourseTicket) {
        await prisma.courseTicket.update({
          where: {
            checkoutSessionId: session.id,
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
          },
        });
      }
    }
  }
}
