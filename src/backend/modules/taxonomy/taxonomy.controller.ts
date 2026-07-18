import { status } from "elysia";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	CreateTagBody,
	GetCategoryBySlugParams,
	GetTagBySlugParams,
} from "#/shared/types/taxonomy.type";
import {
	createTagService,
	getCategoryBySlugService,
	getTagBySlugService,
	listCategoriesService,
	listTagsService,
} from "./taxonomy.service";

export const listTags = async () => {
	const data = await listTagsService();

	return responseOk({ data, message: "Tags retrieved successfully" });
};

export const getTagBySlug = async ({
	params,
}: {
	params: GetTagBySlugParams;
}) => {
	const data = await getTagBySlugService(params);

	return responseOk({ data, message: "Tag retrieved successfully" });
};

export const createTag = async ({ body }: { body: CreateTagBody }) => {
	const data = await createTagService(body);

	return status(
		HttpStatusCode.CREATED,
		responseOk({ data, message: "Tag created successfully" }),
	);
};

export const listCategories = async () => {
	const data = await listCategoriesService();

	return responseOk({ data, message: "Categories retrieved successfully" });
};

export const getCategoryBySlug = async ({
	params,
}: {
	params: GetCategoryBySlugParams;
}) => {
	const data = await getCategoryBySlugService(params);

	return responseOk({ data, message: "Category retrieved successfully" });
};
