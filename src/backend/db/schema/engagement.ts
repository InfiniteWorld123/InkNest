import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { posts } from "./posts";

export const likes = pgTable(
	"likes",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.postId] }),
		index("likes_post_id_idx").on(table.postId),
	],
);

export const bookmarks = pgTable(
	"bookmarks",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.postId] }),
		index("bookmarks_post_id_idx").on(table.postId),
	],
);

export const follows = pgTable(
	"follows",
	{
		followerId: text("follower_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		followingId: text("following_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.followerId, table.followingId] }),
		index("follows_following_id_idx").on(table.followingId),
		check("follows_no_self", sql`${table.followerId} <> ${table.followingId}`),
	],
);

export const postViews = pgTable(
	"post_views",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
		viewedAt: timestamp("viewed_at").defaultNow().notNull(),
	},
	(table) => [
		index("post_views_post_id_idx").on(table.postId),
		index("post_views_user_id_idx").on(table.userId),
	],
);
