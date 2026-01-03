import { APIError } from "better-auth/*";
import { Resend } from "resend";
import { StatusCodes } from "http-status-codes";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("Resend api key not provided");
}

export const resend = new Resend(process.env.RESEND_API_KEY);
