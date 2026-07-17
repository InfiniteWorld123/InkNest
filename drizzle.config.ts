import { env } from "#/shared/env";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/backend/db/migrations",
  schema: [
    "./src/backend/db/schema/auth.ts",
    "./src/backend/db/schema/posts.ts",
    "./src/backend/db/schema/comments.ts",
    "./src/backend/db/schema/taxonomy.ts",
    "./src/backend/db/schema/engagement.ts",
    "./src/backend/db/schema/notifications.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
