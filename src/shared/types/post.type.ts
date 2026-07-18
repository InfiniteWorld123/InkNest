import type * as v from "valibot";
import type {
	CreatePostBodySchema,
	GetPostBySlugParamsSchema,
	ListPostsQuerySchema,
	PostIdParamsSchema,
	UpdatePostBodySchema,
} from "../validation/post.validation";

export type ListPostsQueryType = v.InferOutput<typeof ListPostsQuerySchema>;

export type GetPostBySlugParamsType = v.InferOutput<
	typeof GetPostBySlugParamsSchema
>;

export type PostIdParamsType = v.InferOutput<typeof PostIdParamsSchema>;

export type CreatePostBodyType = v.InferOutput<typeof CreatePostBodySchema>;

export type UpdatePostBodyType = v.InferOutput<typeof UpdatePostBodySchema>;

export type CreatePostServiceType = {
	authorId: string;
	body: CreatePostBodyType;
};

export type UpdatePostServiceType = {
	authorId: string;
	params: PostIdParamsType;
	body: UpdatePostBodyType;
};

export type DeletePostServiceType = {
	authorId: string;
	params: PostIdParamsType;
};
