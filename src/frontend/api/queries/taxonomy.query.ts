import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type { CreateTagBody } from "#/shared/types/taxonomy.type";
import { getErrorMessage } from "../utils";

export type TagItem = {
  name: string;
  slug: string;
};

export type CategoryItem = {
  name: string;
  slug: string;
};

export const taxonomyKeys = {
  all: ["taxonomy"] as const,
  tags: () => [...taxonomyKeys.all, "tags"] as const,
  tagList: () => [...taxonomyKeys.tags(), "list"] as const,
  tagDetail: (slug: string) =>
    [...taxonomyKeys.tags(), "detail", slug] as const,
  categories: () => [...taxonomyKeys.all, "categories"] as const,
  categoryList: () => [...taxonomyKeys.categories(), "list"] as const,
  categoryDetail: (slug: string) =>
    [...taxonomyKeys.categories(), "detail", slug] as const,
};

export const listTagsQueryOptions = () =>
  queryOptions({
    queryKey: taxonomyKeys.tagList(),
    queryFn: async () => {
      const result = await safe_API().tags.get();

      if (result.error) {
        throw new Error(getErrorMessage(result.error, "Unable to load tags"));
      }

      return {
        ...result.data,
        data: result.data.data as TagItem[],
      };
    },
  });

export const tagBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: taxonomyKeys.tagDetail(slug),
    queryFn: async () => {
      const result = await safe_API().tags({ slug }).get();

      if (result.error) {
        throw new Error(getErrorMessage(result.error, "Unable to load tag"));
      }

      return result.data;
    },
  });

export const listCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: taxonomyKeys.categoryList(),
    queryFn: async () => {
      const result = await safe_API().categories.get();

      if (result.error) {
        throw new Error(
          getErrorMessage(result.error, "Unable to load categories"),
        );
      }

      return {
        ...result.data,
        data: result.data.data as CategoryItem[],
      };
    },
  });

export const categoryBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: taxonomyKeys.categoryDetail(slug),
    queryFn: async () => {
      const result = await safe_API().categories({ slug }).get();

      if (result.error) {
        throw new Error(
          getErrorMessage(result.error, "Unable to load category"),
        );
      }

      return result.data;
    },
  });

export const createTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateTagBody) => {
      const result = await safe_API().tags.post(body);

      if (result.error) {
        throw new Error(getErrorMessage(result.error, "Unable to create tag"));
      }

      return result.data;
    },
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: taxonomyKeys.tagList() });

      const previousTags = queryClient.getQueryData<TagItem[]>(
        taxonomyKeys.tagList(),
      );

      queryClient.setQueryData<TagItem[]>(
        taxonomyKeys.tagList(),
        (old = []) => [...old, { name: body.name, slug: body.slug }],
      );

      return { previousTags };
    },
    onError: (error, _body, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(taxonomyKeys.tagList(), context.previousTags);
      }

      console.log(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taxonomyKeys.tags() });
    },
  });
};
