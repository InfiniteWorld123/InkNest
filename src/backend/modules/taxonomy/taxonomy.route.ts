import { Elysia } from "elysia";
import {
	CreateTagBodySchema,
	GetCategoryBySlugParamsSchema,
	GetTagBySlugParamsSchema,
} from "#/shared/validation/taxonomy.validation";
import {
	createTag,
	getCategoryBySlug,
	getTagBySlug,
	listCategories,
	listTags,
} from "./taxonomy.controller";

export const taxonomyRoutes = new Elysia()
	.get("/tags", listTags)
	.get("/tags/:slug", getTagBySlug, {
		params: GetTagBySlugParamsSchema,
	})
	.post("/tags", createTag, {
		body: CreateTagBodySchema,
	})
	.get("/categories", listCategories)
	.get("/categories/:slug", getCategoryBySlug, {
		params: GetCategoryBySlugParamsSchema,
	});
