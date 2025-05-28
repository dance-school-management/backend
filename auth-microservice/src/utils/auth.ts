import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, openAPI } from "better-auth/plugins";
import prisma from "./prisma";
import { createProfile } from "../grpc/profile/profile";
import { APIError } from "better-auth/api";
import { expo } from "@better-auth/expo";
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
            "STUDENT",
          );

          return ctx.json(returned);
        } catch (err: any) {
          try {
            await ctx.context.internalAdapter.deleteUser(id || userId);
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
  plugins: [openAPI(), expo()],
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
  trustedOrigins: [
    "http://localhost:8000",
    "http://localhost:3000",
    "Myexpo://",
  ],
});
