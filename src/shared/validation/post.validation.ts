import * as v from "valibot";
import {
	PositiveIntegerPathParamSchema,
	PositiveIntegerQueryStringSchema,
} from "./common.validation";
import { hasMeaningfulPostContent } from "../post-content";
import { SlugSchema } from "./taxonomy.validation";

export const PostTitleSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "Post title is required"),
	v.maxLength(200, "Post title must be 200 characters or fewer"),
);

export const PostContentSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "Post content is required"),
	v.maxLength(100_000, "Post content is too long"),
	v.check(hasMeaningfulPostContent, "Write some story content before saving"),
);

export const PostImageSchema = v.pipe(
	v.string(),
	v.trim(),
	v.url("Post image must be a valid URL"),
);

export const PostStatusSchema = v.picklist(["draft", "published", "archived"]);

export const PublishedAtSchema = v.pipe(
	v.string(),
	v.isoTimestamp("Published date must be a valid ISO timestamp"),
	v.toDate(),
);

const TagsQuerySchema = v.pipe(
	v.union([v.string(), v.array(v.string())]),
	v.transform((value) =>
		(Array.isArray(value) ? value : value.split(","))
			.map((tag) => tag.trim())
			.filter(Boolean),
	),
	v.array(SlugSchema),
	v.minLength(1, "At least one tag is required"),
	v.maxLength(20, "You may filter by at most 20 tags"),
);

export const ListPostsQuerySchema = v.object({
	search: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, "Search cannot be empty"),
			v.maxLength(100, "Search must be 100 characters or fewer"),
		),
	),
	category: v.optional(SlugSchema),
	tags: v.optional(TagsQuerySchema),
	sortBy: v.optional(v.picklist(["date", "views", "likes", "bookmarks"])),
	order: v.optional(v.picklist(["asc", "desc"])),
	page: v.optional(PositiveIntegerQueryStringSchema),
	limit: v.optional(v.pipe(PositiveIntegerQueryStringSchema, v.maxValue(100))),
});

export const GetPostBySlugParamsSchema = v.object({
	slug: SlugSchema,
});

export const PostIdParamsSchema = v.object({
	postId: PositiveIntegerPathParamSchema,
});

export const CreatePostBodySchema = v.object({
	title: PostTitleSchema,
	slug: SlugSchema,
	image: v.optional(v.nullable(PostImageSchema)),
	content: PostContentSchema,
	status: v.optional(PostStatusSchema),
	publishedAt: v.optional(v.nullable(PublishedAtSchema)),
});

export const UpdatePostBodySchema = v.pipe(
	v.object({
		title: v.optional(PostTitleSchema),
		slug: v.optional(SlugSchema),
		image: v.optional(v.nullable(PostImageSchema)),
		content: v.optional(PostContentSchema),
		status: v.optional(PostStatusSchema),
		publishedAt: v.optional(v.nullable(PublishedAtSchema)),
	}),
	v.check(
		(body) => Object.values(body).some((value) => value !== undefined),
		"At least one field is required",
	),
);
