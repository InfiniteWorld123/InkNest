import { and, eq, type SQL, sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { posts } from "#/backend/db/schema/posts";
import {
	ensureUpdateBody,
	requireCreated,
	requireFound,
} from "#/backend/shared/service-utils";
import type {
	CreatePostBody,
	GetPostBySlugParams,
	ListPostsQuery,
	PostIdParams,
	UpdatePostBody,
} from "#/shared/types/post.type";

type CreatePostInput = {
	authorId: string;
	body: CreatePostBody;
};
type UpdatePostInput = {
	authorId: string;
	params: PostIdParams;
	body: UpdatePostBody;
};
type DeletePostInput = {
	authorId: string;
	params: PostIdParams;
};

const postReturningFields = {
	id: posts.id,
	authorId: posts.authorId,
	title: posts.title,
	slug: posts.slug,
	image: posts.image,
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
}: ListPostsQuery) => {
	const conditions: SQL[] = [
		sql`p.status = 'published'`,
		sql`p.published_at <= NOW()`,
	];

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
		conditions.push(sql`EXISTS (
			SELECT 1
			FROM post_categories AS post_category
			INNER JOIN categories AS category
				ON category.id = post_category.category_id
			WHERE post_category.post_id = p.id
				AND category.slug = ${category}
		)`);
	}

	if (tags?.length) {
		const tagValues = tags.map((tag) => sql`${tag}`);
		conditions.push(sql`EXISTS (
			SELECT 1
			FROM post_tags AS post_tag
			INNER JOIN tags AS tag
				ON tag.id = post_tag.tag_id
			WHERE post_tag.post_id = p.id
				AND tag.slug IN (${sql.join(tagValues, sql`, `)})
		)`);
	}

	const sortColumns: Record<NonNullable<ListPostsQuery["sortBy"]>, SQL> = {
		date: sql`p.published_at`,
		views: sql`COALESCE(view_count.count, 0)`,
		likes: sql`COALESCE(like_count.count, 0)`,
		bookmarks: sql`COALESCE(bookmark_count.count, 0)`,
	};
	const sortDirection = order === "asc" ? sql`ASC` : sql`DESC`;
	const countResult = await db.execute(sql`
		SELECT COUNT(DISTINCT p.id)::integer AS total
		FROM posts AS p
		INNER JOIN "user" AS u
			ON u.id = p.author_id
		WHERE ${sql.join(conditions, sql` AND `)}
	`);
	const total = Number(countResult.rows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const currentPage = Math.min(page, totalPages);
	const offset = (currentPage - 1) * limit;

	const result = await db.execute(sql`
		SELECT
			p.id,
			p.title,
			p.slug,
			p.image,
			p.content,
			p.published_at AS "publishedAt",
			p.created_at AS "createdAt",
			p.updated_at AS "updatedAt",
			u.id AS "authorId",
			u.name AS "authorName",
			u.username AS "authorUsername",
			u.image AS "authorImage",
			COALESCE(like_count.count, 0)::integer AS "likesCount",
			COALESCE(view_count.count, 0)::integer AS "viewsCount",
			COALESCE(bookmark_count.count, 0)::integer AS "bookmarksCount"
		FROM posts AS p
		INNER JOIN "user" AS u
			ON u.id = p.author_id
		LEFT JOIN (
			SELECT post_id, COUNT(*)::integer AS count
			FROM likes
			GROUP BY post_id
		) AS like_count
			ON like_count.post_id = p.id
		LEFT JOIN (
			SELECT post_id, COUNT(*)::integer AS count
			FROM post_views
			GROUP BY post_id
		) AS view_count
			ON view_count.post_id = p.id
		LEFT JOIN (
			SELECT post_id, COUNT(*)::integer AS count
			FROM bookmarks
			GROUP BY post_id
		) AS bookmark_count
			ON bookmark_count.post_id = p.id
		WHERE ${sql.join(conditions, sql` AND `)}
		ORDER BY ${sortColumns[sortBy]} ${sortDirection}, p.id DESC
		LIMIT ${limit}
		OFFSET ${offset}
	`);

	return {
		items: result.rows,
		pagination: {
			page: currentPage,
			limit,
			total,
			totalPages,
			hasPreviousPage: currentPage > 1,
			hasNextPage: currentPage < totalPages,
		},
	};
};

export const getPostBySlugService = async (params: GetPostBySlugParams) => {
	const result = await db.execute(sql`
		SELECT
			p.id,
			p.title,
			p.slug,
			p.image,
			p.content,
			p.published_at AS "publishedAt",
			p.created_at AS "createdAt",
			p.updated_at AS "updatedAt",
			u.id AS "authorId",
			u.name AS "authorName",
			u.username AS "authorUsername",
			u.image AS "authorImage",
			COALESCE(like_count.count, 0)::integer AS "likesCount",
			COALESCE(view_count.count, 0)::integer AS "viewsCount",
			COALESCE(bookmark_count.count, 0)::integer AS "bookmarksCount"
		FROM posts AS p
		INNER JOIN "user" AS u
			ON u.id = p.author_id
		LEFT JOIN (
			SELECT post_id, COUNT(*)::integer AS count
			FROM likes
			GROUP BY post_id
		) AS like_count
			ON like_count.post_id = p.id
		LEFT JOIN (
			SELECT post_id, COUNT(*)::integer AS count
			FROM post_views
			GROUP BY post_id
		) AS view_count
			ON view_count.post_id = p.id
		LEFT JOIN (
			SELECT post_id, COUNT(*)::integer AS count
			FROM bookmarks
			GROUP BY post_id
		) AS bookmark_count
			ON bookmark_count.post_id = p.id
		WHERE p.slug = ${params.slug}
			AND p.status = 'published'
			AND p.published_at <= NOW()
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
			image,
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
}: CreatePostInput) => {
	const publishedAt =
		body.status === "published" && body.publishedAt == null
			? new Date()
			: body.publishedAt;
	const result = await db
		.insert(posts)
		.values({ authorId, ...body, publishedAt })
		.returning(postReturningFields);

	return requireCreated(result[0], "Post could not be created");
};

export const updatePostService = async ({
	authorId,
	params,
	body,
}: UpdatePostInput) => {
	ensureUpdateBody(body);

	const result = await db
		.update(posts)
		.set({
			...body,
			publishedAt:
				body.status === "published" && body.publishedAt == null
					? sql`COALESCE(${posts.publishedAt}, NOW())`
					: body.publishedAt,
			updatedAt: new Date(),
		})
		.where(and(eq(posts.id, params.postId), eq(posts.authorId, authorId)))
		.returning(postReturningFields);

	return requireFound(result[0], "Post not found");
};

export const deletePostService = async ({
	authorId,
	params,
}: DeletePostInput) => {
	const result = await db
		.delete(posts)
		.where(and(eq(posts.id, params.postId), eq(posts.authorId, authorId)))
		.returning({ id: posts.id, slug: posts.slug });

	return requireFound(result[0], "Post not found");
};
