import { Head, Text } from "@react-email/components";

type AdminSendPasswordEmailProps = {
  password: string;
  first_name: string;
  surname: string;
};

export const AdminSendPasswordEmail = (props: AdminSendPasswordEmailProps) => {
  return (
    <>
      <Head>
        <title>Dance school management app - your password</title>
      </Head>
      <Text>
        Hi {props.first_name} {props.surname}! Your employee account has been
        created. Here is the password to your account: {props.password}
      </Text>
    </>
  );
};
