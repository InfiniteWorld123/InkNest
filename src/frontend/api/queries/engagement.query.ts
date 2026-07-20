import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import { getErrorMessage } from "../utils";

export const engagementKeys = {
	all: ["engagement"] as const,
	postLikes: (postId: number) =>
		[...engagementKeys.all, "post-likes", postId] as const,
	postLikesCount: (postId: number) =>
		[...engagementKeys.all, "post-likes-count", postId] as const,
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

			return result.data;
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
		onSuccess: (_data, { postId }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikes(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikesCount(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserLikes(),
			});
		},
		onError: (error) => {
			console.log(error.message);
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
		onSuccess: (_data, { postId }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikes(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.postLikesCount(postId),
			});
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserLikes(),
			});
		},
		onError: (error) => {
			console.log(error.message);
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
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserBookmarks(),
			});
		},
		onError: (error) => {
			console.log(error.message);
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
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.currentUserBookmarks(),
			});
		},
		onError: (error) => {
			console.log(error.message);
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
		onSuccess: (_data, { username }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.followers(username),
			});
		},
		onError: (error) => {
			console.log(error.message);
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
		onSuccess: (_data, { username }) => {
			queryClient.invalidateQueries({
				queryKey: engagementKeys.followers(username),
			});
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const recordPostViewMutation = () => {
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
		onError: (error) => {
			console.log(error.message);
		},
	});
};
