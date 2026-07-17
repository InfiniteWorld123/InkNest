import type * as v from "valibot";
import type {
	CreateTagBodySchema,
	GetCategoryBySlugParamsSchema,
	GetTagBySlugParamsSchema,
} from "../validation/taxonomy.validation";

export type GetTagBySlugParamsType = v.InferOutput<
	typeof GetTagBySlugParamsSchema
>;

export type CreateTagBodyType = v.InferOutput<typeof CreateTagBodySchema>;

export type GetCategoryBySlugParamsType = v.InferOutput<
	typeof GetCategoryBySlugParamsSchema
>;
