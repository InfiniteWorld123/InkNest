import type {
	PostIdParamsType,
	UserIdParamsType,
	UsernameParamsType,
} from "#/shared/types/engagement.type";
import type { AuthenticatedUserType } from "#/shared/types/users.type";
import {
	bookmarkPostService,
	countPostLikesService,
	followUserService,
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
	params: PostIdParamsType;
}) => {
	return listUsersWhoLikedPostService({ params });
};

export const countPostLikes = async ({
	params,
}: {
	params: PostIdParamsType;
}) => {
	return countPostLikesService({ params });
};

export const listCurrentUserLikedPosts = async ({
	user,
}: {
	user: AuthenticatedUserType;
}) => {
	return listCurrentUserLikedPostsService(user.id);
};

export const likePost = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: PostIdParamsType;
}) => {
	return likePostService({ userId: user.id, params });
};

export const unlikePost = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: PostIdParamsType;
}) => {
	return unlikePostService({ userId: user.id, params });
};

export const listCurrentUserBookmarks = async ({
	user,
}: {
	user: AuthenticatedUserType;
}) => {
	return listCurrentUserBookmarksService(user.id);
};

export const bookmarkPost = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: PostIdParamsType;
}) => {
	return bookmarkPostService({ userId: user.id, params });
};

export const removePostBookmark = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: PostIdParamsType;
}) => {
	return removePostBookmarkService({ userId: user.id, params });
};

export const listUserFollowers = async ({
	params,
}: {
	params: UsernameParamsType;
}) => {
	return listUserFollowersService({ params });
};

export const listUserFollowing = async ({
	params,
}: {
	params: UsernameParamsType;
}) => {
	return listUserFollowingService({ params });
};

export const followUser = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: UserIdParamsType;
}) => {
	return followUserService({ followerId: user.id, params });
};

export const unfollowUser = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: UserIdParamsType;
}) => {
	return unfollowUserService({ followerId: user.id, params });
};

export const recordPostView = async ({
	user,
	params,
}: {
	user?: AuthenticatedUserType | null;
	params: PostIdParamsType;
}) => {
	return recordPostViewService({ userId: user?.id ?? null, params });
};
