import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { requireFound } from "#/backend/shared/service-utils";

export const listNotificationsService = async () => {
  const result = await db.execute(sql`
		SELECT *
		FROM notifications
	`);

  return result.rows;
};

export const markNotificationReadService = async (id: number) => {
  const result = await db.execute(sql`
		UPDATE notifications
		SET is_read = true
		WHERE id = ${id}
		RETURNING *
	`);

  return requireFound(result.rows[0], "Notification not found");
};

export const markAllNotificationsReadService = async () => {
  const result = await db.execute(sql`
		UPDATE notifications
		SET is_read = true
		WHERE is_read = false
		RETURNING *
	`);

  return result.rows;
};

export const deleteNotificationService = async (id: number) => {
  const result = await db.execute(sql`
		DELETE FROM notifications
		WHERE id = ${id}
		RETURNING *
	`);

  return requireFound(result.rows[0], "Notification not found");
};
