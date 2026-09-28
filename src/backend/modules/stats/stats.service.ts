import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import type { PlatformStats } from "#/shared/types/stats.type";

type StatsRow = {
	published_posts: number;
	active_writers: number;
	topics: number;
};

export const getPlatformStatsService = async (): Promise<PlatformStats> => {
	const result = await db.execute<StatsRow>(sql`
		SELECT
			(SELECT COUNT(*)::int FROM posts WHERE status = 'published') AS published_posts,
			(SELECT COUNT(DISTINCT author_id)::int FROM posts WHERE status = 'published') AS active_writers,
			((SELECT COUNT(*) FROM tags) + (SELECT COUNT(*) FROM categories))::int AS topics
	`);
	const row = result.rows[0];

	return {
		publishedPosts: row?.published_posts ?? 0,
		activeWriters: row?.active_writers ?? 0,
		topics: row?.topics ?? 0,
	};
};
