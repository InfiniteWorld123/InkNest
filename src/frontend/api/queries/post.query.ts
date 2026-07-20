import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type {
	CreatePostBody,
	ListPostsQuery,
	UpdatePostBody,
} from "#/shared/types/post.type";
import { getErrorMessage } from "../utils";

export const postKeys = {
	all: ["posts"] as const,
	lists: () => [...postKeys.all, "list"] as const,
	list: (query: ListPostsQuery) => [...postKeys.lists(), query] as const,
	details: () => [...postKeys.all, "detail"] as const,
	detail: (slug: string) => [...postKeys.details(), slug] as const,
	mine: () => [...postKeys.all, "mine"] as const,
};

export const listPostsQueryOptions = (query: ListPostsQuery = {}) =>
	queryOptions({
		queryKey: postKeys.list(query),
		queryFn: async () => {
			const result = await safe_API().posts.get({ query });

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load posts"));
			}

			return result.data;
		},
	});

export const postBySlugQueryOptions = (slug: string) =>
	queryOptions({
		queryKey: postKeys.detail(slug),
		queryFn: async () => {
			const result = await safe_API().posts["by-slug"]({ slug }).get();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load post"));
			}

			return result.data;
		},
	});

export const currentUserPostsQueryOptions = () =>
	queryOptions({
		queryKey: postKeys.mine(),
		queryFn: async () => {
			const result = await safe_API().users.me.posts.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load your posts"),
				);
			}

			return result.data;
		},
	});

export const createPostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: CreatePostBody) => {
			const result = await safe_API().posts.post(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to create post"));
			}

			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const updatePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			body,
		}: {
			postId: number;
			body: UpdatePostBody;
		}) => {
			const result = await safe_API().posts({ postId }).patch(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to update post"));
			}

			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const deletePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ postId }: { postId: number }) => {
			const result = await safe_API().posts({ postId }).delete();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to delete post"));
			}

			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};
