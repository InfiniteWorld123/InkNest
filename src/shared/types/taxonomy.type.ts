import type * as v from "valibot";
import type {
	CreateTagBodySchema,
	GetCategoryBySlugParamsSchema,
	GetTagBySlugParamsSchema,
} from "../validation/taxonomy.validation";

export type GetTagBySlugParams = v.InferOutput<typeof GetTagBySlugParamsSchema>;

export type CreateTagBody = v.InferOutput<typeof CreateTagBodySchema>;

export type GetCategoryBySlugParams = v.InferOutput<
	typeof GetCategoryBySlugParamsSchema
>;
