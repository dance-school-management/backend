import { betterAuth } from "better-auth";
import { PrismaClient } from '@prisma/client';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins"

const prisma = new PrismaClient();


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    plugins: [ 
      openAPI(), 
  ],
  user: {
		modelName: "user",
		additionalFields: {
			customField: {
				type: "string"
			}
		}
  },
    emailAndPassword: { 
        enabled: true, 
        autoSignIn: false
      }, 
  });