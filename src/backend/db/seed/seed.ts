import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { writeSeed } from "./seed.database";
import {
	buildSeedData,
	DEFAULT_COVER_BASE_URL,
	SEED_EMAIL_DOMAIN,
	seedSummary,
} from "./seed.generator";

const databaseUrl = process.env.DATABASE_URL;
const coverBaseUrl =
	process.env.BASE_URL?.replace(/\/$/, "") ?? DEFAULT_COVER_BASE_URL;
const data = buildSeedData(new Date(), coverBaseUrl);

if (process.argv.includes("--dry-run")) {
	console.info("InkNest seed dry run", seedSummary(data));
} else {
	if (!databaseUrl) throw new Error("DATABASE_URL is required to seed");
	const written = await writeSeed(drizzle(databaseUrl), data);
	console.info("InkNest seed complete", { ...seedSummary(data), written });
	console.info(`Rerun to replace only @${SEED_EMAIL_DOMAIN} data.`);
}
