import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { badRequestError } from "#/backend/shared/error";
import { requireFound } from "#/backend/shared/service-utils";
import type {
	CommentIdParams,
	CreateCommentBody,
	ListPostCommentsQuery,
	PostCommentsParams,
	UpdateCommentBody,
} from "#/shared/types/comments.type";

type ListPostCommentsInput = {
	params: PostCommentsParams;
	query: ListPostCommentsQuery;
};
type CreateCommentInput = {
	userId: string;
	params: PostCommentsParams;
	body: CreateCommentBody;
};
type UpdateCommentInput = {
	userId: string;
	params: CommentIdParams;
	body: UpdateCommentBody;
};
type DeleteCommentInput = {
	userId: string;
	params: CommentIdParams;
};

const ensurePublishedPostExists = async (postId: number) => {
	const result = await db.execute(sql`
		SELECT id
		FROM posts
		WHERE id = ${postId}
			AND status = 'published'
	`);

	requireFound(result.rows[0], "Post not found");
};

export const listPostCommentsService = async ({
	params,
	query: { cursor, limit = 20 },
}: ListPostCommentsInput) => {
	const fetchLimit = limit + 1;
	const result = await db.execute(sql`
		SELECT
			comment.id,
			comment.user_id AS "userId",
			comment.post_id AS "postId",
			comment.parent_id AS "parentId",
			comment.content,
			comment.created_at AS "createdAt",
			author.name AS "authorName",
			author.username AS "authorUsername",
			author.image AS "authorImage",
			parent_author.name AS "parentAuthorName",
			parent_author.username AS "parentAuthorUsername"
		FROM comments AS comment
		INNER JOIN posts AS post
			ON post.id = comment.post_id
		INNER JOIN "user" AS author
			ON author.id = comment.user_id
		LEFT JOIN comments AS parent
			ON parent.id = comment.parent_id
		LEFT JOIN "user" AS parent_author
			ON parent_author.id = parent.user_id
		WHERE comment.post_id = ${params.postId}
			AND post.status = 'published'
			AND (
				${cursor ?? null}::integer IS NULL
				OR (comment.created_at, comment.id) < (
					SELECT cursor_comment.created_at, cursor_comment.id
					FROM comments AS cursor_comment
					WHERE cursor_comment.id = ${cursor ?? null}
						AND cursor_comment.post_id = ${params.postId}
				)
			)
		ORDER BY comment.created_at DESC, comment.id DESC
		LIMIT ${fetchLimit}
	`);

	const hasMore = result.rows.length > limit;
	const items = result.rows.slice(0, limit);
	const lastComment = items.at(-1) as { id: number } | undefined;

	return {
		items,
		nextCursor: hasMore ? (lastComment?.id ?? null) : null,
	};
};

export const createCommentService = async ({
	userId,
	params,
	body,
}: CreateCommentInput) => {
	await ensurePublishedPostExists(params.postId);
	const parentCondition = body.parentId
		? sql`EXISTS (
			SELECT 1
			FROM comments AS parent
			WHERE parent.id = ${body.parentId}
				AND parent.post_id = ${params.postId}
		)`
		: sql`TRUE`;

	const result = await db.execute(sql`
		INSERT INTO comments (
			user_id,
			parent_id,
			post_id,
			content
		)
		SELECT
			${userId},
			${body.parentId ?? null},
			${params.postId},
			${body.content}
		WHERE ${parentCondition}
		RETURNING
			id,
			user_id AS "userId",
			post_id AS "postId",
			parent_id AS "parentId",
			content,
			created_at AS "createdAt"
	`);

	const comment = result.rows[0];

	if (!comment) {
		throw badRequestError("Parent comment must belong to the same post");
	}

	const createdCommentResult = await db.execute(sql`
		SELECT
			comment.id,
			comment.user_id AS "userId",
			comment.post_id AS "postId",
			comment.parent_id AS "parentId",
			comment.content,
			comment.created_at AS "createdAt",
			author.name AS "authorName",
			author.username AS "authorUsername",
			author.image AS "authorImage",
			parent_author.name AS "parentAuthorName",
			parent_author.username AS "parentAuthorUsername"
		FROM comments AS comment
		INNER JOIN "user" AS author
			ON author.id = comment.user_id
		LEFT JOIN comments AS parent
			ON parent.id = comment.parent_id
		LEFT JOIN "user" AS parent_author
			ON parent_author.id = parent.user_id
		WHERE comment.id = ${comment.id}
	`);

	return requireFound(createdCommentResult.rows[0], "Comment not found");
};

export const updateCommentService = async ({
	userId,
	params,
	body,
}: UpdateCommentInput) => {
	const result = await db.execute(sql`
		UPDATE comments
		SET content = ${body.content}
		WHERE id = ${params.id}
			AND user_id = ${userId}
		RETURNING
			id,
			user_id AS "userId",
			post_id AS "postId",
			parent_id AS "parentId",
			content,
			created_at AS "createdAt"
	`);

	return requireFound(result.rows[0], "Comment not found");
};

export const deleteCommentService = async ({
	userId,
	params,
}: DeleteCommentInput) => {
	const result = await db.execute(sql`
		DELETE FROM comments
		WHERE id = ${params.id}
			AND user_id = ${userId}
		RETURNING
			id,
			post_id AS "postId"
	`);

	return requireFound(result.rows[0], "Comment not found");
};
