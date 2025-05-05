import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8080",
  plugins: [inferAdditionalFields({
    user: {
      role: {
        type: "string",
        input: false,
        required: true,
        defaultValue: "user",
      },
      surname: {
        type: "string",
        input: true,
        required: true,
      },
      description: {
        type: "string",
        input: true,
        required: false,
      },
      phone: {
        type: "string",
        input: true,
        required: false,
      },
      date_of_start_working: {
        type: "string",
        input: true,
        required: false,
      }
    }
  })],
});

export type AuthClient = typeof authClient.$Infer;
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

export const { signIn, signUp, signOut, useSession } = authClient;