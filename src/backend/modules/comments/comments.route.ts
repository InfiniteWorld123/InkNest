import { Elysia } from "elysia";
import {
	createComment,
	deleteComment,
	listPostComments,
	updateComment,
} from "./comments.controller";

export const commentsRoutes = new Elysia()
	.get("/posts/:postId/comments", listPostComments)
	.post("/posts/:postId/comments", createComment)
	.patch("/comments/:id", updateComment)
	.delete("/comments/:id", deleteComment);
