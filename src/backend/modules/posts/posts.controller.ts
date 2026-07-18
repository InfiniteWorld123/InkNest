import type {
	CreatePostBodyType,
	GetPostBySlugParamsType,
	ListPostsQueryType,
	PostIdParamsType,
	UpdatePostBodyType,
} from "#/shared/types/post.type";
import type { AuthenticatedUserType } from "#/shared/types/users.type";
import {
	createPostService,
	deletePostService,
	getPostBySlugService,
	listCurrentUserPostsService,
	listPostsService,
	updatePostService,
} from "./posts.service";

export const listPosts = async ({ query }: { query: ListPostsQueryType }) => {
	return listPostsService(query);
};

export const getPostBySlug = async ({
	params,
}: {
	params: GetPostBySlugParamsType;
}) => {
	return getPostBySlugService(params);
};

export const listCurrentUserPosts = async ({
	user,
}: {
	user: AuthenticatedUserType;
}) => {
	return listCurrentUserPostsService(user.id);
};

export const createPost = async ({
	user,
	body,
}: {
	user: AuthenticatedUserType;
	body: CreatePostBodyType;
}) => {
	return createPostService({ authorId: user.id, body });
};

export const updatePost = async ({
	user,
	params,
	body,
}: {
	user: AuthenticatedUserType;
	params: PostIdParamsType;
	body: UpdatePostBodyType;
}) => {
	return updatePostService({ authorId: user.id, params, body });
};

export const deletePost = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: PostIdParamsType;
}) => {
	return deletePostService({ authorId: user.id, params });
};
