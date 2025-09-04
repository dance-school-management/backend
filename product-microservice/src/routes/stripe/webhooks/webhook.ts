import { Router } from "express";
import { webhook } from "../../../controllers/stripe/webhooks/webhook";
import express from "express"

const router = Router()

router.post("/", express.raw({ type: "application/json" }), webhook)

export default router