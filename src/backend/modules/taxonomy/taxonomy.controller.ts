import type {
  CreateTagBodyType,
  GetCategoryBySlugParamsType,
  GetTagBySlugParamsType,
} from "#/shared/types/taxonomy.type";
import {
  createTagService,
  getCategoryBySlugService,
  getTagBySlugService,
  listCategoriesService,
  listTagsService,
} from "./taxonomy.service";

export const listTags = async () => {
  return listTagsService();
};

export const getTagBySlug = async ({
  params,
}: {
  params: GetTagBySlugParamsType;
}) => {
  return getTagBySlugService(params);
};

export const createTag = async ({ body }: { body: CreateTagBodyType }) => {
  return createTagService(body);
};

export const listCategories = async () => {
  return listCategoriesService();
};

export const getCategoryBySlug = async ({
  params,
}: {
  params: GetCategoryBySlugParamsType;
}) => {
  return getCategoryBySlugService(params);
};
