import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
import {
	CommentIdParamsSchema,
	CreateCommentBodySchema,
	PostCommentsParamsSchema,
	UpdateCommentBodySchema,
} from "#/shared/validation/comments.validation";
import {
	createComment,
	deleteComment,
	listPostComments,
	updateComment,
} from "./comments.controller";

export const commentsRoutes = new Elysia()
	.use(authPlugin)
	.get("/posts/:postId/comments", listPostComments, {
		params: PostCommentsParamsSchema,
	})
	.guard({ auth: true }, (app) =>
		app
			.post("/posts/:postId/comments", createComment, {
				params: PostCommentsParamsSchema,
				body: CreateCommentBodySchema,
			})
			.patch("/comments/:id", updateComment, {
				params: CommentIdParamsSchema,
				body: UpdateCommentBodySchema,
			})
			.delete("/comments/:id", deleteComment, {
				params: CommentIdParamsSchema,
			}),
	);
