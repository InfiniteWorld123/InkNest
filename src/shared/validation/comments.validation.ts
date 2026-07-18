import * as v from "valibot";

const UrlPositiveIntegerSchema = v.pipe(
	v.string(),
	v.regex(/^\d+$/, "ID must be a positive integer"),
	v.toNumber(),
	v.integer(),
	v.minValue(1, "ID must be a positive integer"),
);

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
	postId: UrlPositiveIntegerSchema,
});

export const CommentIdParamsSchema = v.object({
	id: UrlPositiveIntegerSchema,
});

export const CreateCommentBodySchema = v.object({
	content: CommentContentSchema,
	parentId: v.optional(v.nullable(BodyPositiveIntegerSchema)),
});

export const UpdateCommentBodySchema = v.object({
	content: CommentContentSchema,
});
