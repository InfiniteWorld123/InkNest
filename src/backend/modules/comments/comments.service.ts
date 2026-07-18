import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { requireCreated, requireFound } from "#/backend/shared/service-utils";
import type {
	CreateCommentServiceType,
	DeleteCommentServiceType,
	ListPostCommentsServiceType,
	UpdateCommentServiceType,
} from "#/shared/types/comments.type";

export const listPostCommentsService = async ({
	params,
}: ListPostCommentsServiceType) => {
	const result = await db.execute(sql`
		SELECT
			id,
			user_id AS "userId",
			post_id AS "postId",
			parent_id AS "parentId",
			content,
			created_at AS "createdAt"
		FROM comments
		WHERE post_id = ${params.postId}
		ORDER BY created_at ASC
	`);

	return result.rows;
};

export const createCommentService = async ({
	userId,
	params,
	body,
}: CreateCommentServiceType) => {
	const result = await db.execute(sql`
		INSERT INTO comments (
			user_id,
			parent_id,
			post_id,
			content
		)
		VALUES (
			${userId},
			${body.parentId ?? null},
			${params.postId},
			${body.content}
		)
		RETURNING
			id,
			user_id AS "userId",
			post_id AS "postId",
			parent_id AS "parentId",
			content,
			created_at AS "createdAt"
	`);

	return requireCreated(result.rows[0], "Comment could not be created");
};

export const updateCommentService = async ({
	userId,
	params,
	body,
}: UpdateCommentServiceType) => {
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
}: DeleteCommentServiceType) => {
	const result = await db.execute(sql`
		DELETE FROM comments
		WHERE id = ${params.id}
			AND user_id = ${userId}
		RETURNING
			id,
			post_id AS "postId"
	`);

	return result.rows[0] ?? null;
};
