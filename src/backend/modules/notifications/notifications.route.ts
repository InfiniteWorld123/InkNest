import { Elysia } from "elysia";
import {
	deleteNotification,
	listNotifications,
	markAllNotificationsRead,
	markNotificationRead,
} from "./notifications.controller";

export const notificationsRoutes = new Elysia({ prefix: "/notifications" })
	.get("/", listNotifications)
	.patch("/read-all", markAllNotificationsRead)
	.patch("/:id/read", markNotificationRead)
	.delete("/:id", deleteNotification);
