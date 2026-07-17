import * as v from "valibot";

export const SlugSchema = v.pipe(
	v.string(),
	v.trim(),
	v.toLowerCase(),
	v.minLength(1, "Slug is required"),
	v.maxLength(120, "Slug must be 120 characters or fewer"),
	v.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug may contain only lowercase letters, numbers, and hyphens",
	),
);

export const GetTagBySlugParamsSchema = v.object({
	slug: SlugSchema,
});

export const CreateTagBodySchema = v.object({
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Tag name is required"),
		v.maxLength(80, "Tag name must be 80 characters or fewer"),
	),
	slug: SlugSchema,
});

export const GetCategoryBySlugParamsSchema = v.object({
	slug: SlugSchema,
});
