import {
	type InfiniteData,
	infiniteQueryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type {
	CreateCommentBody,
	UpdateCommentBody,
} from "#/shared/types/comments.type";
import { getErrorMessage } from "../utils";

export type CommentItem = {
	id: number;
	userId: string;
	postId: number;
	parentId: number | null;
	content: string;
	createdAt: string | Date;
	authorName: string;
	authorUsername: string | null;
	authorImage: string | null;
	parentAuthorName: string | null;
	parentAuthorUsername: string | null;
	isOptimistic?: boolean;
};

export type CommentPage = {
	items: CommentItem[];
	nextCursor: number | null;
};

type OptimisticCommentAuthor = {
	userId: string;
	name: string;
	username: string | null;
	image: string | null;
};

type OptimisticCommentParent = {
	name: string;
	username: string | null;
};

const COMMENTS_PAGE_SIZE = 20;

export const commentKeys = {
	all: ["comments"] as const,
	lists: () => [...commentKeys.all, "list"] as const,
	list: (postId: number) => [...commentKeys.lists(), postId] as const,
};

export const postCommentsQueryOptions = (postId: number) =>
	infiniteQueryOptions({
		queryKey: commentKeys.list(postId),
		staleTime: 30_000,
		initialPageParam: null as number | null,
		queryFn: async ({ pageParam }) => {
			const result = await safe_API()
				.posts({ postId })
				.comments.get({
					query: {
						limit: COMMENTS_PAGE_SIZE,
						cursor: pageParam ?? undefined,
					},
				});

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load comments"),
				);
			}

			return result.data.data as CommentPage;
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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
			author: OptimisticCommentAuthor;
			parent?: OptimisticCommentParent;
		}) => {
			const result = await safe_API().posts({ postId }).comments.post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to create comment"),
				);
			}

			return result.data.data as CommentItem;
		},
		onMutate: async ({ postId, body, author, parent }) => {
			const queryKey = commentKeys.list(postId);
			await queryClient.cancelQueries({ queryKey });
			const previousComments =
				queryClient.getQueryData<InfiniteData<CommentPage>>(queryKey);
			const optimisticId = -Date.now();
			const optimisticComment: CommentItem = {
				id: optimisticId,
				userId: author.userId,
				postId,
				parentId: body.parentId ?? null,
				content: body.content,
				createdAt: new Date(),
				authorName: author.name,
				authorUsername: author.username,
				authorImage: author.image,
				parentAuthorName: parent?.name ?? null,
				parentAuthorUsername: parent?.username ?? null,
				isOptimistic: true,
			};

			queryClient.setQueryData<InfiniteData<CommentPage>>(queryKey, (old) => {
				if (!old) {
					return {
						pages: [{ items: [optimisticComment], nextCursor: null }],
						pageParams: [null],
					};
				}

				return {
					...old,
					pages: old.pages.map((page, index) =>
						index === 0
							? { ...page, items: [optimisticComment, ...page.items] }
							: page,
					),
				};
			});

			return { previousComments, optimisticId };
		},
		onError: (error, { postId }, context) => {
			queryClient.setQueryData(
				commentKeys.list(postId),
				context?.previousComments,
			);
			console.log(error.message);
		},
		onSuccess: (comment, { postId }, context) => {
			queryClient.setQueryData<InfiniteData<CommentPage>>(
				commentKeys.list(postId),
				(old) => {
					if (!old) return old;

					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							items: page.items.map((item) =>
								item.id === context?.optimisticId ? comment : item,
							),
						})),
					};
				},
			);
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
		onMutate: async ({ id, body }) => {
			await queryClient.cancelQueries({ queryKey: commentKeys.lists() });

			const previousLists = queryClient.getQueriesData<
				InfiniteData<CommentPage>
			>({
				queryKey: commentKeys.lists(),
			});

			queryClient.setQueriesData<InfiniteData<CommentPage>>(
				{ queryKey: commentKeys.lists() },
				(old) =>
					old
						? {
								...old,
								pages: old.pages.map((page) => ({
									...page,
									items: page.items.map((comment) =>
										comment.id === id
											? { ...comment, content: body.content }
											: comment,
									),
								})),
							}
						: old,
			);

			return { previousLists };
		},
		onError: (error, _variables, context) => {
			for (const [key, data] of context?.previousLists ?? []) {
				queryClient.setQueryData(key, data);
			}

			console.log(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: commentKeys.all });
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
		onMutate: async ({ id }) => {
			await queryClient.cancelQueries({ queryKey: commentKeys.lists() });

			const previousLists = queryClient.getQueriesData<
				InfiniteData<CommentPage>
			>({
				queryKey: commentKeys.lists(),
			});

			queryClient.setQueriesData<InfiniteData<CommentPage>>(
				{ queryKey: commentKeys.lists() },
				(old) => {
					if (!old) return old;

					const comments = old.pages.flatMap((page) => page.items);
					const deletedIds = new Set([id]);
					let foundDescendant = true;

					while (foundDescendant) {
						foundDescendant = false;

						for (const comment of comments) {
							if (
								comment.parentId &&
								deletedIds.has(comment.parentId) &&
								!deletedIds.has(comment.id)
							) {
								deletedIds.add(comment.id);
								foundDescendant = true;
							}
						}
					}

					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							items: page.items.filter(
								(comment) => !deletedIds.has(comment.id),
							),
						})),
					};
				},
			);

			return { previousLists };
		},
		onError: (error, _variables, context) => {
			for (const [key, data] of context?.previousLists ?? []) {
				queryClient.setQueryData(key, data);
			}

			console.log(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: commentKeys.all });
		},
	});
};
