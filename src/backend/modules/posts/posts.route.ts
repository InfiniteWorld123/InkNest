import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
import {
	CreatePostBodySchema,
	GetPostBySlugParamsSchema,
	ListPostsQuerySchema,
	PostIdParamsSchema,
	UpdatePostBodySchema,
} from "#/shared/validation/post.validation";
import {
	createPost,
	deletePost,
	getPostBySlug,
	listCurrentUserPosts,
	listPosts,
	updatePost,
} from "./posts.controller";

export const postsRoutes = new Elysia()
	.use(authPlugin)
	.get("/posts", listPosts, { query: ListPostsQuerySchema })
	.get("/posts/by-slug/:slug", getPostBySlug, {
		params: GetPostBySlugParamsSchema,
	})
	.guard({ auth: true }, (app) =>
		app
			.get("/users/me/posts", listCurrentUserPosts)
			.post("/posts", createPost, { body: CreatePostBodySchema })
			.patch("/posts/:postId", updatePost, {
				params: PostIdParamsSchema,
				body: UpdatePostBodySchema,
			})
			.delete("/posts/:postId", deletePost, {
				params: PostIdParamsSchema,
			}),
	);
