import * as v from "valibot";
import {
	PositiveIntegerPathParamSchema,
	PositiveIntegerQueryStringSchema,
} from "./common.validation";
import { SlugSchema } from "./taxonomy.validation";

const TitleSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "Post title is required"),
	v.maxLength(200, "Post title must be 200 characters or fewer"),
);

const tiptapNodeHasText = (node: unknown): boolean => {
	if (typeof node !== "object" || node === null) return false;

	if (
		"text" in node &&
		typeof node.text === "string" &&
		node.text.trim() !== ""
	) {
		return true;
	}

	return (
		"content" in node &&
		Array.isArray(node.content) &&
		node.content.some(tiptapNodeHasText)
	);
};

const hasPostContent = (content: string): boolean => {
	try {
		const parsed: unknown = JSON.parse(content);

		if (
			typeof parsed === "object" &&
			parsed !== null &&
			"type" in parsed &&
			parsed.type === "doc"
		) {
			return tiptapNodeHasText(parsed);
		}
	} catch {
		// Existing posts use plain text, which stays valid during this migration.
	}

	return true;
};

const ContentSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "Post content is required"),
	v.maxLength(100_000, "Post content is too long"),
	v.check(hasPostContent, "Post content is required"),
);

const ImageSchema = v.pipe(
	v.string(),
	v.trim(),
	v.url("Post image must be a valid URL"),
);

const PostStatusSchema = v.picklist(["draft", "published", "archived"]);

const PublishedAtSchema = v.pipe(
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
	title: TitleSchema,
	slug: SlugSchema,
	image: v.optional(v.nullable(ImageSchema)),
	content: ContentSchema,
	status: v.optional(PostStatusSchema),
	publishedAt: v.optional(v.nullable(PublishedAtSchema)),
});

export const UpdatePostBodySchema = v.pipe(
	v.object({
		title: v.optional(TitleSchema),
		slug: v.optional(SlugSchema),
		image: v.optional(v.nullable(ImageSchema)),
		content: v.optional(ContentSchema),
		status: v.optional(PostStatusSchema),
		publishedAt: v.optional(v.nullable(PublishedAtSchema)),
	}),
	v.check(
		(body) => Object.values(body).some((value) => value !== undefined),
		"At least one field is required",
	),
);
