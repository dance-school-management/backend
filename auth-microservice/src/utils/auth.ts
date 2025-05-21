import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, openAPI } from "better-auth/plugins";
import prisma from "./prisma";
import { createProfile } from "../grpc/profile/profile";
import { APIError } from "better-auth/api";
export const auth = betterAuth({
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const returned: any = ctx.context.returned;
        if (returned instanceof APIError) {
          return returned;
        }
        const userId: string = returned.user.id;
        const { first_name, surname } = ctx.body;

        try {
          const responseProfile = await createProfile(
            userId,
            first_name,
            surname,
            "STUDENT",
          );
          return ctx.json(returned);
        } catch (err: any) {
          try {
            await ctx.context.internalAdapter.deleteUser(userId);
          } catch (err2: any) {
            logger.error(
              `Error deleting user in auth service after profile creation error`,
            );
          }
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message:
              "User account creation failed, problem with profile creation",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      }
    }),
  },
  plugins: [openAPI()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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
  trustedOrigins: ["http://localhost:8000"],
});
