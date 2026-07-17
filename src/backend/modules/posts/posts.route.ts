import { Elysia } from "elysia";
import {
	createPost,
	deletePost,
	getPostBySlug,
	listCurrentUserPosts,
	listPosts,
	updatePost,
} from "./posts.controller";

export const postsRoutes = new Elysia()
	.get("/posts", listPosts)
	.get("/users/me/posts", listCurrentUserPosts)
	.get("/posts/:slug", getPostBySlug)
	.post("/posts", createPost)
	.patch("/posts/:id", updatePost)
	.delete("/posts/:id", deletePost);
