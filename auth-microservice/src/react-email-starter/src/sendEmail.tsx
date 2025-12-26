import { resend } from "./resend";
import { ResetPasswordEmail } from "../emails/reset-password";

export async function sendEmail({
  to,
  emailType,
  url,
}: {
  to: string;
  emailType: string;
  url: string;
}) {
  const sourceEmail = process.env.RESEND_SOURCE_EMAIL;

  if (!sourceEmail) {
    throw new Error("Resend source email not provided in environment");
  }

  switch (emailType) {
    case "RESET_PASSWORD":
      console.log("test");
      try {
        await resend.emails.send({
          from: sourceEmail,
          to,
          subject: "Dance school management app - reset your password",
          react: <ResetPasswordEmail url={url} />,
        });
      } catch (err) {
        console.log(err);
      }

      break;
  }
}
