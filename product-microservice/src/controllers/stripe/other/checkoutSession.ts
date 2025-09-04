import { Request, Response } from "express";
import prisma from "../../../utils/prisma";
import { stripe } from "../../../utils/stripe";

export async function createCheckoutSession(
  req: Request<{}, {}, { classId: number }> & { user?: any },
  res: Response,
) {
  const userId = req.user?.id;
  const { classId } = req.body;

  const theClass = await prisma.class.findFirst({
    where: {
      id: classId,
    },
    include: {
      classTemplate: true,
    },
  });

  if (!theClass) {
    throw new Error("Product not found!");
  }

  const price = theClass.classTemplate.price;

  const idempotencyKey = `checkout-${userId}-${classId}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      success_url: "https://www.youtube.com/watch?v=0VE0zjlbD60",
      cancel_url: "https://www.youtube.com/watch?v=t8lnCA8PHJM",
      line_items: [
        {
          price_data: {
            product_data: {
              name: theClass.classTemplate.name,
              description: theClass.classTemplate.description,
            },
            unit_amount: price.toNumber() * 100,
            currency: "pln",
          },
          quantity: 1,
        },
      ],
      metadata: { userId, classId },
    },
    { idempotencyKey },
  );

  res.json({ sessionUrl: session.url });
}
