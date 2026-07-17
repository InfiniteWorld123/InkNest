import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
import { NotificationIdParamsSchema } from "#/shared/validation/notifications.validation";
import {
	deleteNotification,
	listNotifications,
	markAllNotificationsRead,
	markNotificationRead,
} from "./notifications.controller";

export const notificationsRoutes = new Elysia({ prefix: "/notifications" })
	.use(authPlugin)
	.guard({ auth: true }, (app) =>
		app
			.get("/", listNotifications)
			.patch("/read-all", markAllNotificationsRead)
			.patch("/:id/read", markNotificationRead, {
				params: NotificationIdParamsSchema,
			})
			.delete("/:id", deleteNotification, {
				params: NotificationIdParamsSchema,
			}),
	);
