import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, createAuthMiddleware, openAPI } from "better-auth/plugins";
import prisma from "./prisma";
import { createProfile } from "../grpc/client/profileCommunication/profile";
import { APIError } from "better-auth/api";
import { expo } from "@better-auth/expo";
import {
  sendResetPasswordEmail,
  sendYourPasswordEmail,
} from "../../src/react-email-starter/src/sendEmail";

export const auth = betterAuth({
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/admin/create-user") {
        const requestBody: { role: string } = ctx.body as any;

        const providedRole = requestBody.role;

        if (!["INSTRUCTOR", "COORDINATOR", "admin"].includes(providedRole)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid employee role",
            code: "BAD_REQUEST",
          });
        }
      }

      if (ctx.path === "/sign-up/email") {
        const requestBody: { role: string } = ctx.body;

        const providedRole = requestBody.role;

        if (!["STUDENT"].includes(providedRole)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid employee role",
            code: "BAD_REQUEST",
          });
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/admin/create-user") {
        const returned: any = ctx.context.returned;

        if (returned instanceof APIError) {
          return returned;
        }
        const requestBody: {
          role: string;
          shouldSendEmail?: boolean;
          email: string;
          first_name: string;
          surname: string;
          password: string;
        } = ctx.body;

        const providedRole = requestBody.role;

        await createProfileUtil(ctx, returned, providedRole);

        if (requestBody.shouldSendEmail) {
          await sendYourPasswordEmail({
            to: requestBody.email,
            first_name: requestBody.first_name,
            surname: requestBody.surname,
            password: requestBody.password,
          });
        }

        return ctx.json(returned);
      }
      if (ctx.path === "/sign-up/email") {
        const returned: any = ctx.context.returned;

        if (returned instanceof APIError) {
          return returned;
        }

        await createProfileUtil(ctx, returned, "STUDENT");

        return ctx.json(returned);
      }
    }),
  },
  plugins: [
    openAPI(),
    expo(),
    admin({ adminRoles: ["admin"], defaultRole: "STUDENT" }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const resetPasswordRoute = "http://localhost:3000/auth/reset-password";
      const finalUrl = `${resetPasswordRoute}?token=${token}`;

      sendResetPasswordEmail({
        to: user.email,
        url: finalUrl,
      });
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: false,
      },
    },
  },
  trustedOrigins: [
    "http://localhost:8000",
    "http://localhost:3000",
    "Myexpo://",
  ],
});

function checkAdministratorRole(
  user: { role: string } | undefined | null,
): boolean {
  return !!user && user.role === "admin";
}

function checkRoleType(role: string): boolean {
  const validRoles = ["admin", "COORDINATOR", "INSTRUCTOR", "STUDENT"];
  return validRoles.includes(role);
}

async function createProfileUtil(ctx: any, returned: any, role: string) {
  const userId: string = returned.user.id;
  const { first_name, surname } = ctx.body;
  let id = ctx.body.id || null;
  try {
    if (id) {
      await ctx.context.internalAdapter.updateUser(userId, {
        id,
      });
    }
  } catch {
    logger.error(`Error updating user id, default id stays`);
    id = null;
  }

  try {
    const responseProfile = await createProfile(
      id || userId,
      first_name,
      surname,
      role,
    );
  } catch (err: any) {
    try {
      await ctx.context.internalAdapter.deleteUser(id || userId);
    } catch (err2: any) {
      logger.error(
        `Error deleting user in auth service after profile creation error`,
      );
    }

    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "User account creation failed, problem with profile creation",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}