import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { requireCreated, requireFound } from "#/backend/shared/service-utils";
import type {
	CreateTagBody,
	GetCategoryBySlugParams,
	GetTagBySlugParams,
} from "#/shared/types/taxonomy.type";

export const listTagsService = async () => {
	const result = await db.execute(sql`
		SELECT
			name,
			slug
		FROM tags
	`);

	return result.rows;
};

export const getTagBySlugService = async (params: GetTagBySlugParams) => {
	const result = await db.execute(sql`
		SELECT
			name,
			slug
		FROM tags
		WHERE slug = ${params.slug}
	`);

	return requireFound(result.rows[0], "Tag not found");
};

export const createTagService = async ({ name, slug }: CreateTagBody) => {
	const result = await db.execute(sql`
		INSERT INTO tags (
			name,
			slug
		)
		VALUES (
			${name},
			${slug}
		)
		RETURNING
			name,
			slug
	`);

	return requireCreated(result.rows[0], "Tag could not be created");
};

export const listCategoriesService = async () => {
	const result = await db.execute(sql`
		SELECT
			name,
			slug
		FROM categories
	`);

	return result.rows;
};

export const getCategoryBySlugService = async (
	params: GetCategoryBySlugParams,
) => {
	const result = await db.execute(sql`
		SELECT
			name,
			slug
		FROM categories
		WHERE slug = ${params.slug}
	`);

	return requireFound(result.rows[0], "Category not found");
};
