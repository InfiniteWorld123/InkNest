import type * as v from "valibot";
import type {
	CreatePostBodySchema,
	GetPostBySlugParamsSchema,
	ListPostsQuerySchema,
	PostIdParamsSchema,
	UpdatePostBodySchema,
} from "../validation/post.validation";

export type ListPostsQuery = v.InferOutput<typeof ListPostsQuerySchema>;

export type GetPostBySlugParams = v.InferOutput<
	typeof GetPostBySlugParamsSchema
>;

export type PostIdParams = v.InferOutput<typeof PostIdParamsSchema>;

export type CreatePostBody = v.InferOutput<typeof CreatePostBodySchema>;

export type UpdatePostBody = v.InferOutput<typeof UpdatePostBodySchema>;
