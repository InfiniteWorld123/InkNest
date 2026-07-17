import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
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
	.get("/posts", listPosts)
	.get("/posts/:slug", getPostBySlug)
	.guard({ auth: true }, (app) =>
		app
			.get("/users/me/posts", listCurrentUserPosts)
			.post("/posts", createPost)
			.patch("/posts/:id", updatePost)
			.delete("/posts/:id", deletePost),
	);
