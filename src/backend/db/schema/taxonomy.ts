import { index, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const tags = pgTable("tags", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
});

export const categories = pgTable("categories", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
});

export const postTags = pgTable(
	"post_tags",
	{
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tags.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.postId, table.tagId] }),
		index("post_tags_tag_id_idx").on(table.tagId),
	],
);

export const postCategories = pgTable(
	"post_categories",
	{
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		categoryId: integer("category_id")
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.postId, table.categoryId] }),
		index("post_categories_category_id_idx").on(table.categoryId),
	],
);
