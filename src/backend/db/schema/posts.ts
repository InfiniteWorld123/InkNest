import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const postStatus = pgEnum("post_status", [
	"draft",
	"published",
	"archived",
]);

export const posts = pgTable(
	"posts",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		slug: text("slug").notNull().unique(),
		image: text("image"),
		content: text("content").notNull(),
		status: postStatus("status").default("draft").notNull(),
		publishedAt: timestamp("published_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("posts_author_id_idx").on(table.authorId)],
);
