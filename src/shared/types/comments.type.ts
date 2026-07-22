import type * as v from "valibot";
import type {
	CommentIdParamsSchema,
	CreateCommentBodySchema,
	ListPostCommentsQuerySchema,
	PostCommentsParamsSchema,
	UpdateCommentBodySchema,
} from "../validation/comments.validation";

export type PostCommentsParams = v.InferOutput<typeof PostCommentsParamsSchema>;

export type ListPostCommentsQuery = v.InferOutput<
	typeof ListPostCommentsQuerySchema
>;

export type CommentIdParams = v.InferOutput<typeof CommentIdParamsSchema>;

export type CreateCommentBody = v.InferOutput<typeof CreateCommentBodySchema>;

export type UpdateCommentBody = v.InferOutput<typeof UpdateCommentBodySchema>;
