import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY;

if (!stripeApiKey) throw new Error("No stripe api key provided");

export const stripe = new Stripe(stripeApiKey);
