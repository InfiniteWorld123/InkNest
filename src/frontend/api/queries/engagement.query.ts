import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import { getErrorMessage } from "../utils";
import { type PublicPost, postKeys } from "./post.query";
import type { CurrentUser } from "./users.query";
import { userKeys } from "./users.query";

export type LikeCount = {
	count: number;
};

export type PostViewerEngagement = {
	liked: boolean;
	bookmarked: boolean;
};

export type BookmarkedPost = {
	id: number;
	authorId: string;
	title: string;
	slug: string;
	content: string;
	status: string;
	publishedAt: string | Date | null;
	createdAt: string | Date;
	updatedAt: string | Date;
	bookmarkedAt: string | Date;
};

export type FollowUser = {
	id: string;
	name: string;
	username: string;
	image: string | null;
	followedAt: string | Date;
};

export const engagementKeys = {
	all: ["engagement"] as const,
	postLikes: (postId: number) =>
		[...engagementKeys.all, "post-likes", postId] as const,
	postLikesCount: (postId: number) =>
		[...engagementKeys.all, "post-likes-count", postId] as const,
	postViewer: (postId: number) =>
		[...engagementKeys.all, "post-viewer", postId] as const,
	currentUserLikes: () =>
		[...engagementKeys.all, "current-user-likes"] as const,
	currentUserBookmarks: () =>
		[...engagementKeys.all, "current-user-bookmarks"] as const,
	followers: (username: string) =>
		[...engagementKeys.all, "followers", username] as const,
	following: (username: string) =>
		[...engagementKeys.all, "following", username] as const,
};

export const postLikesQueryOptions = (postId: number) =>
	queryOptions({
		queryKey: engagementKeys.postLikes(postId),
		queryFn: async () => {
			const result = await safe_API().posts({ postId }).likes.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load post likes"),
				);
			}

			return result.data;
		},
	});

export const postViewerEngagementQueryOptions = (postId: number) =>
	queryOptions({
		queryKey: engagementKeys.postViewer(postId),
		staleTime: 10_000,
		queryFn: async () => {
			const result = await safe_API()
				.posts({ postId })
				["viewer-engagement"].get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load your post activity"),
				);
			}

			return result.data.data as PostViewerEngagement;
		},
	});

export const postLikesCountQueryOptions = (postId: number) =>
	queryOptions({
		queryKey: engagementKeys.postLikesCount(postId),
		queryFn: async () => {
			const result = await safe_API().posts({ postId }).likes.count.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load like count"),
				);
			}

			return result.data.data as LikeCount;
		},
	});

export const currentUserLikedPostsQueryOptions = () =>
	queryOptions({
		queryKey: engagementKeys.currentUserLikes(),
		queryFn: async () => {
			const result = await safe_API().users.me.likes.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load liked posts"),
				);
			}

			return result.data;
		},
	});

export const currentUserBookmarksQueryOptions = () =>
	queryOptions({
		queryKey: engagementKeys.currentUserBookmarks(),
		queryFn: async () => {
			const result = await safe_API().users.me.bookmarks.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load bookmarks"),
				);
			}

			return result.data;
		},
	});

export const userFollowersQueryOptions = (username: string) =>
	queryOptions({
		queryKey: engagementKeys.followers(username),
		queryFn: async () => {
			const result = await safe_API().users({ username }).followers.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load followers"),
				);
			}

			return result.data;
		},
	});

export const userFollowingQueryOptions = (username: string) =>
	queryOptions({
		queryKey: engagementKeys.following(username),
		queryFn: async () => {
			const result = await safe_API().users({ username }).following.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load following list"),
				);
			}

			return result.data;
		},
	});

export const likePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ postId }: { postId: number }) => {
			const result = await safe_API().posts({ postId }).like.put();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to like post"));
			}

			return result.data;
		},
		onMutate: async ({ postId }) => {
			await queryClient.cancelQueries({
				queryKey: engagementKeys.postLikesCount(postId),
			});

			const previousCount = queryClient.getQueryData<LikeCount>(
				engagementKeys.postLikesCount(postId),
			);
			const previousViewer = queryClient.getQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
			);

			queryClient.setQueryData<LikeCount>(
				engagementKeys.postLikesCount(postId),
				(old) => (old ? { count: old.count + 1 } : old),
			);
			queryClient.setQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
				(old) => (old ? { ...old, liked: true } : old),
			);

			return { previousCount, previousViewer };
		},
		onError: (error, { postId }, context) => {
			if (context?.previousCount) {
				queryClient.setQueryData(
					engagementKeys.postLikesCount(postId),
					context.previousCount,
				);
			}
			if (context?.previousViewer) {
				queryClient.setQueryData(
					engagementKeys.postViewer(postId),
					context.previousViewer,
				);
			}

			console.log(error.message);
		},
		onSettled: (_data, _error, { postId }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikes(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikesCount(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserLikes(),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postViewer(postId),
			});
			queryClient.invalidateQueries({ queryKey: postKeys.details() });
			queryClient.invalidateQueries({ queryKey: postKeys.lists() });
		},
	});
};

export const unlikePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ postId }: { postId: number }) => {
			const result = await safe_API().posts({ postId }).like.delete();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to unlike post"));
			}

			return result.data;
		},
		onMutate: async ({ postId }) => {
			await queryClient.cancelQueries({
				queryKey: engagementKeys.postLikesCount(postId),
			});

			const previousCount = queryClient.getQueryData<LikeCount>(
				engagementKeys.postLikesCount(postId),
			);
			const previousViewer = queryClient.getQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
			);

			queryClient.setQueryData<LikeCount>(
				engagementKeys.postLikesCount(postId),
				(old) => (old ? { count: Math.max(0, old.count - 1) } : old),
			);
			queryClient.setQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
				(old) => (old ? { ...old, liked: false } : old),
			);

			return { previousCount, previousViewer };
		},
		onError: (error, { postId }, context) => {
			if (context?.previousCount) {
				queryClient.setQueryData(
					engagementKeys.postLikesCount(postId),
					context.previousCount,
				);
			}
			if (context?.previousViewer) {
				queryClient.setQueryData(
					engagementKeys.postViewer(postId),
					context.previousViewer,
				);
			}

			console.log(error.message);
		},
		onSettled: (_data, _error, { postId }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikes(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikesCount(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserLikes(),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postViewer(postId),
			});
			queryClient.invalidateQueries({ queryKey: postKeys.details() });
			queryClient.invalidateQueries({ queryKey: postKeys.lists() });
		},
	});
};

export const bookmarkPostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ postId }: { postId: number }) => {
			const result = await safe_API().posts({ postId }).bookmark.put();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to bookmark post"),
				);
			}

			return result.data;
		},
		// Only postId is known here, and the bookmarks cache needs full post
		// fields (title, slug, ...) that a bookmark toggle doesn't return, so
		// there is nothing safe to write optimistically beyond canceling any
		// in-flight refetch. The list still settles correctly below.
		onMutate: async ({ postId }) => {
			await queryClient.cancelQueries({
				queryKey: engagementKeys.currentUserBookmarks(),
			});

			const previousViewer = queryClient.getQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
			);
			queryClient.setQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
				(old) => (old ? { ...old, bookmarked: true } : old),
			);

			return { previousViewer };
		},
		onError: (error, { postId }, context) => {
			if (context?.previousViewer) {
				queryClient.setQueryData(
					engagementKeys.postViewer(postId),
					context.previousViewer,
				);
			}
			console.log(error.message);
		},
		onSettled: (_data, _error, { postId }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserBookmarks(),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postViewer(postId),
			});
			queryClient.invalidateQueries({ queryKey: postKeys.details() });
			queryClient.invalidateQueries({ queryKey: postKeys.lists() });
		},
	});
};

export const removePostBookmarkMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ postId }: { postId: number }) => {
			const result = await safe_API().posts({ postId }).bookmark.delete();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to remove bookmark"),
				);
			}

			return result.data;
		},
		onMutate: async ({ postId }) => {
			await queryClient.cancelQueries({
				queryKey: engagementKeys.currentUserBookmarks(),
			});

			const previousBookmarks = queryClient.getQueryData<BookmarkedPost[]>(
				engagementKeys.currentUserBookmarks(),
			);
			const previousViewer = queryClient.getQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
			);

			queryClient.setQueryData<BookmarkedPost[]>(
				engagementKeys.currentUserBookmarks(),
				(old) => old?.filter((post) => post.id !== postId),
			);
			queryClient.setQueryData<PostViewerEngagement>(
				engagementKeys.postViewer(postId),
				(old) => (old ? { ...old, bookmarked: false } : old),
			);

			return { previousBookmarks, previousViewer };
		},
		onError: (error, { postId }, context) => {
			if (context?.previousBookmarks) {
				queryClient.setQueryData(
					engagementKeys.currentUserBookmarks(),
					context.previousBookmarks,
				);
			}
			if (context?.previousViewer) {
				queryClient.setQueryData(
					engagementKeys.postViewer(postId),
					context.previousViewer,
				);
			}

			console.log(error.message);
		},
		onSettled: (_data, _error, { postId }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserBookmarks(),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postViewer(postId),
			});
			queryClient.invalidateQueries({ queryKey: postKeys.details() });
			queryClient.invalidateQueries({ queryKey: postKeys.lists() });
		},
	});
};

export const followUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ username }: { username: string }) => {
			const result = await safe_API().users({ username }).follow.put();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to follow user"));
			}

			return result.data;
		},
		onMutate: async ({ username }) => {
			await queryClient.cancelQueries({
				queryKey: engagementKeys.followers(username),
			});

			const previousFollowers = queryClient.getQueryData<FollowUser[]>(
				engagementKeys.followers(username),
			);
			const currentUser = queryClient.getQueryData<CurrentUser>(userKeys.me());

			if (currentUser) {
				queryClient.setQueryData<FollowUser[]>(
					engagementKeys.followers(username),
					(old = []) => [
						{
							id: currentUser.id,
							name: currentUser.name,
							username: currentUser.username,
							image: currentUser.image,
							followedAt: new Date(),
						},
						...old,
					],
				);
			}

			return { previousFollowers };
		},
		onError: (error, { username }, context) => {
			if (context?.previousFollowers) {
				queryClient.setQueryData(
					engagementKeys.followers(username),
					context.previousFollowers,
				);
			}

			console.log(error.message);
		},
		onSettled: (_data, _error, { username }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.followers(username),
			});
		},
	});
};

export const unfollowUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ username }: { username: string }) => {
			const result = await safe_API().users({ username }).follow.delete();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to unfollow user"),
				);
			}

			return result.data;
		},
		onMutate: async ({ username }) => {
			await queryClient.cancelQueries({
				queryKey: engagementKeys.followers(username),
			});

			const previousFollowers = queryClient.getQueryData<FollowUser[]>(
				engagementKeys.followers(username),
			);
			const currentUserId = queryClient.getQueryData<CurrentUser>(
				userKeys.me(),
			)?.id;

			if (currentUserId) {
				queryClient.setQueryData<FollowUser[]>(
					engagementKeys.followers(username),
					(old) => old?.filter((follower) => follower.id !== currentUserId),
				);
			}

			return { previousFollowers };
		},
		onError: (error, { username }, context) => {
			if (context?.previousFollowers) {
				queryClient.setQueryData(
					engagementKeys.followers(username),
					context.previousFollowers,
				);
			}

			console.log(error.message);
		},
		onSettled: (_data, _error, { username }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.followers(username),
			});
		},
	});
};

export const recordPostViewMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ postId }: { postId: number }) => {
			const result = await safe_API().posts({ postId }).views.post();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to record post view"),
				);
			}

			return result.data;
		},
		onMutate: async ({ postId }) => {
			await queryClient.cancelQueries({ queryKey: postKeys.lists() });
			await queryClient.cancelQueries({ queryKey: postKeys.details() });

			const previousLists = queryClient.getQueriesData<PublicPost[]>({
				queryKey: postKeys.lists(),
			});
			const previousDetails = queryClient.getQueriesData<PublicPost>({
				queryKey: postKeys.details(),
			});

			queryClient.setQueriesData<PublicPost[]>(
				{ queryKey: postKeys.lists() },
				(old) =>
					old?.map((post) =>
						post.id === postId
							? { ...post, viewsCount: post.viewsCount + 1 }
							: post,
					),
			);

			queryClient.setQueriesData<PublicPost>(
				{ queryKey: postKeys.details() },
				(old) =>
					old && old.id === postId
						? { ...old, viewsCount: old.viewsCount + 1 }
						: old,
			);

			return { previousLists, previousDetails };
		},
		// View recording is fire-and-forget: no onSettled resync here, since
		// invalidating the browse list on every page view would refetch far
		// more often than the view counter is worth. A failed request just
		// rolls back below.
		onError: (error, _variables, context) => {
			for (const [key, data] of context?.previousLists ?? []) {
				queryClient.setQueryData(key, data);
			}

			for (const [key, data] of context?.previousDetails ?? []) {
				queryClient.setQueryData(key, data);
			}

			console.log(error.message);
		},
	});
};
