import { drizzle } from "drizzle-orm/neon-http";
import { env } from "#/shared/env";

export const db = drizzle(env.DATABASE_URL);
