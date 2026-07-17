import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
import {
	createComment,
	deleteComment,
	listPostComments,
	updateComment,
} from "./comments.controller";

export const commentsRoutes = new Elysia()
	.use(authPlugin)
	.get("/posts/:postId/comments", listPostComments)
	.guard({ auth: true }, (app) =>
		app
			.post("/posts/:postId/comments", createComment)
			.patch("/comments/:id", updateComment)
			.delete("/comments/:id", deleteComment),
	);
