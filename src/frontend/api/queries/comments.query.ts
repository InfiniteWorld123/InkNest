import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type {
	CreateCommentBody,
	UpdateCommentBody,
} from "#/shared/types/comments.type";
import { getErrorMessage } from "../utils";

export const commentKeys = {
	all: ["comments"] as const,
	lists: () => [...commentKeys.all, "list"] as const,
	list: (postId: number) => [...commentKeys.lists(), postId] as const,
};

export const postCommentsQueryOptions = (postId: number) =>
	queryOptions({
		queryKey: commentKeys.list(postId),
		queryFn: async () => {
			const result = await safe_API().posts({ postId }).comments.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load comments"),
				);
			}

			return result.data;
		},
	});

export const createCommentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			body,
		}: {
			postId: number;
			body: CreateCommentBody;
		}) => {
			const result = await safe_API().posts({ postId }).comments.post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to create comment"),
				);
			}

			return result.data;
		},
		onSuccess: (_data, { postId }) => {
			queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const updateCommentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id: number;
			body: UpdateCommentBody;
		}) => {
			const result = await safe_API().comments({ id }).patch(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to update comment"),
				);
			}

			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: commentKeys.all });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const deleteCommentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id }: { id: number }) => {
			const result = await safe_API().comments({ id }).delete();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to delete comment"),
				);
			}

			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: commentKeys.all });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};
