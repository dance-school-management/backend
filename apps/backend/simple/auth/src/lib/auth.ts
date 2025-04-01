import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import Database from "better-sqlite3";
import NodeCache from "node-cache";

const authCache = new NodeCache({ stdTTL: 5 * 60 });

export const auth = betterAuth({
  plugins: [
    openAPI(),
  ],
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000"],
  user: {
    additionalFields: {
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
      }
    }
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await authCache.get<string>(key);
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      await authCache.set(key, value);
    },
    delete: async (key) => {
      await authCache.del(key);
    }
  }
});