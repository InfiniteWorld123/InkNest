import type * as v from "valibot";
import type {
	CommentIdParamsSchema,
	CreateCommentBodySchema,
	PostCommentsParamsSchema,
	UpdateCommentBodySchema,
} from "../validation/comments.validation";

export type PostCommentsParamsType = v.InferOutput<
	typeof PostCommentsParamsSchema
>;

export type CommentIdParamsType = v.InferOutput<typeof CommentIdParamsSchema>;

export type CreateCommentBodyType = v.InferOutput<
	typeof CreateCommentBodySchema
>;

export type UpdateCommentBodyType = v.InferOutput<
	typeof UpdateCommentBodySchema
>;

export type ListPostCommentsServiceType = {
	params: PostCommentsParamsType;
};

export type CreateCommentServiceType = {
	userId: string;
	params: PostCommentsParamsType;
	body: CreateCommentBodyType;
};

export type UpdateCommentServiceType = {
	userId: string;
	params: CommentIdParamsType;
	body: UpdateCommentBodyType;
};

export type DeleteCommentServiceType = {
	userId: string;
	params: CommentIdParamsType;
};
