import { status } from "elysia";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	CreatePostBody,
	GetPostBySlugParams,
	ListPostsQuery,
	PostIdParams,
	UpdatePostBody,
} from "#/shared/types/post.type";
import type { AuthenticatedUser } from "#/shared/types/users.type";
import {
	createPostService,
	deletePostService,
	getPostBySlugService,
	listCurrentUserPostsService,
	listPostsService,
	updatePostService,
} from "./posts.service";

export const listPosts = async ({ query }: { query: ListPostsQuery }) => {
	const data = await listPostsService(query);

	return responseOk({ data, message: "Posts retrieved successfully" });
};

export const getPostBySlug = async ({
	params,
}: {
	params: GetPostBySlugParams;
}) => {
	const data = await getPostBySlugService(params);

	return responseOk({ data, message: "Post retrieved successfully" });
};

export const listCurrentUserPosts = async ({
	user,
}: {
	user: AuthenticatedUser;
}) => {
	const data = await listCurrentUserPostsService(user.id);

	return responseOk({ data, message: "Posts retrieved successfully" });
};

export const createPost = async ({
	user,
	body,
}: {
	user: AuthenticatedUser;
	body: CreatePostBody;
}) => {
	const data = await createPostService({ authorId: user.id, body });

	return status(
		HttpStatusCode.CREATED,
		responseOk({ data, message: "Post created successfully" }),
	);
};

export const updatePost = async ({
	user,
	params,
	body,
}: {
	user: AuthenticatedUser;
	params: PostIdParams;
	body: UpdatePostBody;
}) => {
	const data = await updatePostService({ authorId: user.id, params, body });

	return responseOk({ data, message: "Post updated successfully" });
};

export const deletePost = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: PostIdParams;
}) => {
	const data = await deletePostService({ authorId: user.id, params });

	return responseOk({ data, message: "Post deleted successfully" });
};
