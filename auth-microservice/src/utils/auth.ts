import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, openAPI } from "better-auth/plugins";
import prisma from "./prisma";
import { createProfile } from "../grpc/client/profileCommunication/profile";
import { APIError } from "better-auth/api";
import { expo } from "@better-auth/expo";
export const auth = betterAuth({
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const userHeader = ctx.request?.headers.get("user-context");
        let user;
        if (userHeader) {
          try {
            user = JSON.parse(
              Buffer.from(userHeader, "base64").toString("utf8"),
            );
          } catch (e) {
            logger.error(`Failed to parse user-context header in sign-up`);
          }
        }

        // nobody is logged in
        if (!user) {
          if (![undefined, "STUDENT"].includes(ctx.body.role)) {
            throw new APIError("UNAUTHORIZED", {
              message: `You are not authorized to create account with role: ${ctx.body.role}`,
              code: "UNAUTHORIZED",
            });
          }
        }
        // logged in some user
        if (!checkAdministratorRole(user)) {
          throw new APIError("UNAUTHORIZED", {
            message: `You are not authorized to create account with role: ${ctx.body.role}`,
            code: "UNAUTHORIZED",
          });
        }
        if (!checkRoleType(ctx.body.role)) {
          throw new APIError("BAD_REQUEST", {
            message: `Invalid role type: ${ctx.body.role}`,
          });
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const returned: any = ctx.context.returned;
        if (returned instanceof APIError) {
          return returned;
        }

        // If an admin is creating the account, we don't want to overwrite their session
        const userHeader = ctx.request?.headers.get("user-context");
        if (userHeader) {
          ctx.context.responseHeaders?.delete("Set-Cookie");
          if (returned?.token) {
            try {
              await prisma.session.delete({
                where: {
                  token: returned.token,
                },
              });
            } catch (e) {
              logger.error(
                "Failed to delete session for admin created user",
                e,
              );
            }
          }
          delete returned.token;
        }

        const userId: string = returned.user.id;
        const { first_name, surname, role } = ctx.body;
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
            role || "STUDENT",
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

function checkAdministratorRole(
  user: { role: string } | undefined | null,
): boolean {
  return !!user && user.role === "ADMINISTRATOR";
}

function checkRoleType(role: string): boolean {
  const validRoles = ["ADMINISTRATOR", "COORDINATOR", "INSTRUCTOR", "STUDENT"];
  return validRoles.includes(role);
}
