import { status } from "elysia";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	PostIdParams,
	UsernameParams,
} from "#/shared/types/engagement.type";
import type { AuthenticatedUser } from "#/shared/types/users.type";
import {
	bookmarkPostService,
	countPostLikesService,
	followUserService,
	getPostViewerEngagementService,
	likePostService,
	listCurrentUserBookmarksService,
	listCurrentUserLikedPostsService,
	listUserFollowersService,
	listUserFollowingService,
	listUsersWhoLikedPostService,
	recordPostViewService,
	removePostBookmarkService,
	unfollowUserService,
	unlikePostService,
} from "./engagement.service";

export const listUsersWhoLikedPost = async ({
	params,
}: {
	params: PostIdParams;
}) => {
	const data = await listUsersWhoLikedPostService({ params });

	return responseOk({ data, message: "Post likes retrieved successfully" });
};

export const countPostLikes = async ({ params }: { params: PostIdParams }) => {
	const data = await countPostLikesService({ params });

	return responseOk({
		data,
		message: "Post like count retrieved successfully",
	});
};

export const getPostViewerEngagement = async ({
	user,
	params,
}: {
	user?: AuthenticatedUser | null;
	params: PostIdParams;
}) => {
	const data = await getPostViewerEngagementService({
		userId: user?.id ?? null,
		params,
	});

	return responseOk({
		data,
		message: "Post engagement retrieved successfully",
	});
};

export const listCurrentUserLikedPosts = async ({
	user,
}: {
	user: AuthenticatedUser;
}) => {
	const data = await listCurrentUserLikedPostsService(user.id);

	return responseOk({ data, message: "Liked posts retrieved successfully" });
};

export const likePost = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: PostIdParams;
}) => {
	const data = await likePostService({ userId: user.id, params });

	return responseOk({ data, message: "Post liked successfully" });
};

export const unlikePost = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: PostIdParams;
}) => {
	const data = await unlikePostService({ userId: user.id, params });

	return responseOk({ data, message: "Post unliked successfully" });
};

export const listCurrentUserBookmarks = async ({
	user,
}: {
	user: AuthenticatedUser;
}) => {
	const data = await listCurrentUserBookmarksService(user.id);

	return responseOk({ data, message: "Bookmarks retrieved successfully" });
};

export const bookmarkPost = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: PostIdParams;
}) => {
	const data = await bookmarkPostService({ userId: user.id, params });

	return responseOk({ data, message: "Post bookmarked successfully" });
};

export const removePostBookmark = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: PostIdParams;
}) => {
	const data = await removePostBookmarkService({ userId: user.id, params });

	return responseOk({ data, message: "Bookmark removed successfully" });
};

export const listUserFollowers = async ({
	params,
}: {
	params: UsernameParams;
}) => {
	const data = await listUserFollowersService({ params });

	return responseOk({ data, message: "Followers retrieved successfully" });
};

export const listUserFollowing = async ({
	params,
}: {
	params: UsernameParams;
}) => {
	const data = await listUserFollowingService({ params });

	return responseOk({ data, message: "Following list retrieved successfully" });
};

export const followUser = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: UsernameParams;
}) => {
	const data = await followUserService({ followerId: user.id, params });

	return responseOk({ data, message: "User followed successfully" });
};

export const unfollowUser = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: UsernameParams;
}) => {
	const data = await unfollowUserService({ followerId: user.id, params });

	return responseOk({ data, message: "User unfollowed successfully" });
};

export const recordPostView = async ({
	user,
	params,
}: {
	user?: AuthenticatedUser | null;
	params: PostIdParams;
}) => {
	const data = await recordPostViewService({
		userId: user?.id ?? null,
		params,
	});

	return status(
		HttpStatusCode.CREATED,
		responseOk({ data, message: "Post view recorded successfully" }),
	);
};
