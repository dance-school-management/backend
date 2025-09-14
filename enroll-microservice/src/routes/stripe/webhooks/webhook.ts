import { Router } from "express";
import { handleWebhook } from "../../../controllers/stripe/webhooks/webhook";
import express from "express";

const router = Router();

router.post("/", express.raw({ type: "application/json" }), handleWebhook);

export default router;
