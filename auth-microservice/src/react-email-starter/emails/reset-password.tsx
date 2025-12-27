import { Head, Text } from "@react-email/components";

type ResetPasswordEmailProps = {
  url: string;
};

export const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
  return (
    <>
      <Head>
        <title>Dance school management app - reset password</title>
      </Head>
      <Text>
        We received your request to reset your password. Click this link to
        proceed: {props.url}
      </Text>
    </>
  );
};
