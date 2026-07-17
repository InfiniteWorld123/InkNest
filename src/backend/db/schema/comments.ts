import {
	foreignKey,
	index,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { posts } from "./posts";

export const comments = pgTable(
	"comments",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		parentId: integer("parent_id"),
		content: text("content").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "comments_parent_id_comments_id_fkey",
		}).onDelete("cascade"),
		index("comments_post_id_idx").on(table.postId),
		index("comments_user_id_idx").on(table.userId),
		index("comments_parent_id_idx").on(table.parentId),
	],
);
