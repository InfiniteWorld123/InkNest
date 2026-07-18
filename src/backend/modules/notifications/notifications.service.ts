import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { requireFound } from "#/backend/shared/service-utils";

type NotificationOwnerInput = {
	userId: string;
	notificationId: number;
};

const notificationReturningFields = sql`
	id,
	user_id AS "userId",
	actor_id AS "actorId",
	post_id AS "postId",
	comment_id AS "commentId",
	type,
	is_read AS "isRead",
	created_at AS "createdAt"
`;

export const listNotificationsService = async (userId: string) => {
	const result = await db.execute(sql`
		SELECT ${notificationReturningFields}
		FROM notifications
		WHERE user_id = ${userId}
		ORDER BY created_at DESC
	`);

	return result.rows;
};

export const markNotificationReadService = async ({
	userId,
	notificationId,
}: NotificationOwnerInput) => {
	const result = await db.execute(sql`
		UPDATE notifications
		SET is_read = true
		WHERE id = ${notificationId}
			AND user_id = ${userId}
		RETURNING ${notificationReturningFields}
	`);

	return requireFound(result.rows[0], "Notification not found");
};

export const markAllNotificationsReadService = async (userId: string) => {
	const result = await db.execute(sql`
		UPDATE notifications
		SET is_read = true
		WHERE user_id = ${userId}
			AND is_read = false
		RETURNING ${notificationReturningFields}
	`);

	return result.rows;
};

export const deleteNotificationService = async ({
	userId,
	notificationId,
}: NotificationOwnerInput) => {
	const result = await db.execute(sql`
		DELETE FROM notifications
		WHERE id = ${notificationId}
			AND user_id = ${userId}
		RETURNING ${notificationReturningFields}
	`);

	return requireFound(result.rows[0], "Notification not found");
};
