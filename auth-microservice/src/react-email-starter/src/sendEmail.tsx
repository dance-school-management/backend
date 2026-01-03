import { ResetPasswordEmail } from "../emails/reset-password";
import { AdminSendPasswordEmail } from "../emails/with-password";
import { resend } from "./resend";

export async function sendResetPasswordEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  const sourceEmail = process.env.RESEND_SOURCE_EMAIL;

  if (!sourceEmail) {
    throw new Error("Resend source email not provided in environment");
  }

  await resend.emails.send({
    from: sourceEmail,
    to,
    subject: "Dance school management app - reset your password",
    react: <ResetPasswordEmail url={url} />,
  });
}

export async function sendYourPasswordEmail({
  to,
  first_name,
  surname,
  password,
}: {
  to: string;
  first_name: string;
  surname: string;
  password: string;
}) {
  const sourceEmail = process.env.RESEND_SOURCE_EMAIL;

  if (!sourceEmail) {
    throw new Error("Resend source email not provided in environment");
  }

  await resend.emails.send({
    from: sourceEmail,
    to,
    subject: "Dance school management app - reset your password",
    react: (
      <AdminSendPasswordEmail
        password={password}
        first_name={first_name}
        surname={surname}
      />
    ),
  });
}
