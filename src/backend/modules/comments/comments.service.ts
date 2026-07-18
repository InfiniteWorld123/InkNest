import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { badRequestError } from "#/backend/shared/error";
import { requireFound } from "#/backend/shared/service-utils";
import type {
	CommentIdParams,
	CreateCommentBody,
	PostCommentsParams,
	UpdateCommentBody,
} from "#/shared/types/comments.type";

type ListPostCommentsInput = { params: PostCommentsParams };
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
}: ListPostCommentsInput) => {
	const result = await db.execute(sql`
		SELECT
			comment.id,
			comment.user_id AS "userId",
			comment.post_id AS "postId",
			comment.parent_id AS "parentId",
			comment.content,
			comment.created_at AS "createdAt"
		FROM comments AS comment
		INNER JOIN posts AS post
			ON post.id = comment.post_id
		WHERE comment.post_id = ${params.postId}
			AND post.status = 'published'
		ORDER BY comment.created_at ASC
	`);

	return result.rows;
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

	return comment;
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
