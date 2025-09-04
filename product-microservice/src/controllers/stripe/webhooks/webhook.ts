import { Request } from "express";
import { Response } from "express";
import { stripe } from "../../../utils/stripe";

export async function webhook(
  req: any,
  res: any
) {
  const sig = req.headers["stripe-signature"]

  if (!sig) {
    throw new Error("Stripe signature missing in request");
  }

  let event

  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeWebhookSecret) {
    throw new Error("Stripe webhook secret not provided");
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed: ", err.message);
    return res.sendStatus(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    console.log("Checkout completed: ", session.id, session.payment_status);
    if (session.payment_status === "paid") {
      const userId = session.metadata?.userId
      const classId = session.metadata?.classId

      console.log("userId: ", userId)
      console.log("classId: ", classId)
    }
  }
}
