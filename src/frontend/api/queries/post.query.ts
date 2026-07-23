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

export type PublicPost = {
	id: number;
	title: string;
	slug: string;
	image: string | null;
	content: string;
	publishedAt: string | Date | null;
	createdAt: string | Date;
	updatedAt: string | Date;
	authorId: string;
	authorName: string;
	authorUsername: string;
	authorImage: string | null;
	likesCount: number;
	viewsCount: number;
	bookmarksCount: number;
};

export type PostsPagination = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
};

export type OwnPost = {
	id: number;
	authorId: string;
	title: string;
	slug: string;
	image: string | null;
	content: string;
	status: "draft" | "published" | "archived";
	publishedAt: string | Date | null;
	createdAt: string | Date;
	updatedAt: string | Date;
};

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
		staleTime: 30_000,
		queryFn: async () => {
			const result = await safe_API().posts.get({ query });

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load posts"));
			}

			return {
				data: result.data.data.items as PublicPost[],
				pagination: result.data.data.pagination as PostsPagination,
				success: result.data.success,
				message: result.data.message,
			};
		},
	});

export const postBySlugQueryOptions = (slug: string) =>
	queryOptions({
		queryKey: postKeys.detail(slug),
		staleTime: 30_000,
		queryFn: async () => {
			const result = await safe_API().posts["by-slug"]({ slug }).get();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load post"));
			}

			return {
				...result.data,
				data: result.data.data as PublicPost,
			};
		},
	});

export const currentUserPostsQueryOptions = () =>
	queryOptions({
		queryKey: postKeys.mine(),
		staleTime: 15_000,
		queryFn: async () => {
			const result = await safe_API().users.me.posts.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load your posts"),
				);
			}

			return result.data.data as OwnPost[];
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
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: postKeys.all });
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
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: postKeys.all });
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
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
};
