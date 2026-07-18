import { responseOk } from "#/backend/shared/response";
import type { NotificationIdParams } from "#/shared/types/notifications.type";
import type { AuthenticatedUser } from "#/shared/types/users.type";
import {
	deleteNotificationService,
	listNotificationsService,
	markAllNotificationsReadService,
	markNotificationReadService,
} from "./notifications.service";

export const listNotifications = async ({
	user,
}: {
	user: AuthenticatedUser;
}) => {
	const data = await listNotificationsService(user.id);

	return responseOk({ data, message: "Notifications retrieved successfully" });
};

export const markNotificationRead = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: NotificationIdParams;
}) => {
	const data = await markNotificationReadService({
		userId: user.id,
		notificationId: params.id,
	});

	return responseOk({ data, message: "Notification marked as read" });
};

export const markAllNotificationsRead = async ({
	user,
}: {
	user: AuthenticatedUser;
}) => {
	const data = await markAllNotificationsReadService(user.id);

	return responseOk({ data, message: "All notifications marked as read" });
};

export const deleteNotification = async ({
	user,
	params,
}: {
	user: AuthenticatedUser;
	params: NotificationIdParams;
}) => {
	const data = await deleteNotificationService({
		userId: user.id,
		notificationId: params.id,
	});

	return responseOk({ data, message: "Notification deleted successfully" });
};
