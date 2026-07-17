import { drizzle } from "drizzle-orm/neon-http";
import { env } from "#/shared/env";
import { relations } from "./schema/relations";

export const db = drizzle(env.DATABASE_URL, { relations });
