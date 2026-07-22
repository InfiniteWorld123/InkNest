import * as v from "valibot";
import {
	PositiveIntegerPathParamSchema,
	PositiveIntegerQueryStringSchema,
} from "./common.validation";

const BodyPositiveIntegerSchema = v.pipe(
	v.number(),
	v.integer("Parent comment ID must be an integer"),
	v.minValue(1, "Parent comment ID must be a positive integer"),
);

const CommentContentSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "Comment content is required"),
	v.maxLength(5000, "Comment must be 5000 characters or fewer"),
);

export const PostCommentsParamsSchema = v.object({
	postId: PositiveIntegerPathParamSchema,
});

export const ListPostCommentsQuerySchema = v.object({
	cursor: v.optional(PositiveIntegerQueryStringSchema),
	limit: v.optional(v.pipe(PositiveIntegerQueryStringSchema, v.maxValue(50))),
});

export const CommentIdParamsSchema = v.object({
	id: PositiveIntegerPathParamSchema,
});

export const CreateCommentBodySchema = v.object({
	content: CommentContentSchema,
	parentId: v.optional(v.nullable(BodyPositiveIntegerSchema)),
});

export const UpdateCommentBodySchema = v.object({
	content: CommentContentSchema,
});
