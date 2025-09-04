import { Router } from "express";
import { createCheckoutSession } from "../../../controllers/stripe/other/checkoutSession";

const router = Router()

router.post("/create-checkout-session", createCheckoutSession)

export default router