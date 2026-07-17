import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
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
	.use(authPlugin)
	.get("/tags", listTags)
	.get("/tags/:slug", getTagBySlug, {
		params: GetTagBySlugParamsSchema,
	})
	.guard({ auth: true }, (app) =>
		app.post("/tags", createTag, {
			body: CreateTagBodySchema,
		}),
	)
	.get("/categories", listCategories)
	.get("/categories/:slug", getCategoryBySlug, {
		params: GetCategoryBySlugParamsSchema,
	});
