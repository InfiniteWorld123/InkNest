import { and, eq, type SQL, sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { posts } from "#/backend/db/schema/posts";
import {
	ensureUpdateBody,
	requireCreated,
	requireFound,
} from "#/backend/shared/service-utils";
import type {
	CreatePostServiceType,
	DeletePostServiceType,
	GetPostBySlugParamsType,
	ListPostsQueryType,
	UpdatePostServiceType,
} from "#/shared/types/post.type";

const postReturningFields = {
	id: posts.id,
	authorId: posts.authorId,
	title: posts.title,
	slug: posts.slug,
	content: posts.content,
	status: posts.status,
	publishedAt: posts.publishedAt,
	createdAt: posts.createdAt,
	updatedAt: posts.updatedAt,
};

export const listPostsService = async ({
	search,
	category,
	tags,
	sortBy = "date",
	order = "desc",
	page = 1,
	limit = 10,
}: ListPostsQueryType) => {
	const offset = (page - 1) * limit;
	const conditions: SQL[] = [sql`p.status = 'published'`];
	const filterJoins: SQL[] = [];

	if (search) {
		const searchTerm = `%${search}%`;
		conditions.push(sql`(
			p.title ILIKE ${searchTerm}
			OR p.content ILIKE ${searchTerm}
			OR u.name ILIKE ${searchTerm}
			OR u.username ILIKE ${searchTerm}
		)`);
	}

	if (category) {
		filterJoins.push(sql`
			INNER JOIN post_categories AS post_category
				ON post_category.post_id = p.id
			INNER JOIN categories AS category
				ON category.id = post_category.category_id
		`);
		conditions.push(sql`category.slug = ${category}`);
	}

	if (tags?.length) {
		const tagValues = tags.map((tag) => sql`${tag}`);
		filterJoins.push(sql`
			INNER JOIN post_tags AS post_tag
				ON post_tag.post_id = p.id
			INNER JOIN tags AS tag
				ON tag.id = post_tag.tag_id
		`);
		conditions.push(sql`tag.slug IN (${sql.join(tagValues, sql`, `)})`);
	}

	const sortColumns: Record<NonNullable<ListPostsQueryType["sortBy"]>, SQL> = {
		date: sql`p.published_at`,
		views: sql`"viewsCount"`,
		likes: sql`"likesCount"`,
		bookmarks: sql`"bookmarksCount"`,
	};
	const sortDirection = order === "asc" ? sql`ASC` : sql`DESC`;

	const result = await db.execute(sql`
		SELECT
			p.id,
			p.title,
			p.slug,
			p.content,
			p.published_at AS "publishedAt",
			p.created_at AS "createdAt",
			p.updated_at AS "updatedAt",
			u.id AS "authorId",
			u.name AS "authorName",
			u.username AS "authorUsername",
			u.image AS "authorImage",
			COUNT(DISTINCT post_like.user_id)::integer AS "likesCount",
			COUNT(DISTINCT post_view.id)::integer AS "viewsCount",
			COUNT(DISTINCT bookmark.user_id)::integer AS "bookmarksCount"
		FROM posts AS p
		INNER JOIN "user" AS u
			ON u.id = p.author_id
		${sql.join(filterJoins, sql` `)}
		LEFT JOIN likes AS post_like
			ON post_like.post_id = p.id
		LEFT JOIN post_views AS post_view
			ON post_view.post_id = p.id
		LEFT JOIN bookmarks AS bookmark
			ON bookmark.post_id = p.id
		WHERE ${sql.join(conditions, sql` AND `)}
		GROUP BY p.id, u.id
		ORDER BY ${sortColumns[sortBy]} ${sortDirection}, p.id DESC
		LIMIT ${limit}
		OFFSET ${offset}
	`);

	return result.rows;
};

export const getPostBySlugService = async (params: GetPostBySlugParamsType) => {
	const result = await db.execute(sql`
		SELECT
			p.id,
			p.title,
			p.slug,
			p.content,
			p.published_at AS "publishedAt",
			p.created_at AS "createdAt",
			p.updated_at AS "updatedAt",
			u.id AS "authorId",
			u.name AS "authorName",
			u.username AS "authorUsername",
			u.image AS "authorImage",
			COUNT(DISTINCT post_like.user_id)::integer AS "likesCount",
			COUNT(DISTINCT post_view.id)::integer AS "viewsCount",
			COUNT(DISTINCT bookmark.user_id)::integer AS "bookmarksCount"
		FROM posts AS p
		INNER JOIN "user" AS u
			ON u.id = p.author_id
		LEFT JOIN likes AS post_like
			ON post_like.post_id = p.id
		LEFT JOIN post_views AS post_view
			ON post_view.post_id = p.id
		LEFT JOIN bookmarks AS bookmark
			ON bookmark.post_id = p.id
		WHERE p.slug = ${params.slug}
			AND p.status = 'published'
		GROUP BY p.id, u.id
	`);

	return requireFound(result.rows[0], "Post not found");
};

export const listCurrentUserPostsService = async (authorId: string) => {
	const result = await db.execute(sql`
		SELECT
			id,
			author_id AS "authorId",
			title,
			slug,
			content,
			status,
			published_at AS "publishedAt",
			created_at AS "createdAt",
			updated_at AS "updatedAt"
		FROM posts
		WHERE author_id = ${authorId}
		ORDER BY created_at DESC
	`);

	return result.rows;
};

export const createPostService = async ({
	authorId,
	body,
}: CreatePostServiceType) => {
	const result = await db
		.insert(posts)
		.values({ authorId, ...body })
		.returning(postReturningFields);

	return requireCreated(result[0], "Post could not be created");
};

export const updatePostService = async ({
	authorId,
	params,
	body,
}: UpdatePostServiceType) => {
	ensureUpdateBody(body);

	const result = await db
		.update(posts)
		.set({ ...body, updatedAt: new Date() })
		.where(and(eq(posts.id, params.id), eq(posts.authorId, authorId)))
		.returning(postReturningFields);

	return requireFound(result[0], "Post not found");
};

export const deletePostService = async ({
	authorId,
	params,
}: DeletePostServiceType) => {
	const result = await db
		.delete(posts)
		.where(and(eq(posts.id, params.id), eq(posts.authorId, authorId)))
		.returning({ id: posts.id, slug: posts.slug });

	return requireFound(result[0], "Post not found");
};
