import type { NotificationIdParamsType } from "#/shared/types/notifications.type";
import {
  deleteNotificationService,
  listNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "./notifications.service";

export const listNotifications = async () => {
  return listNotificationsService();
};

export const markNotificationRead = async ({
  params,
}: {
  params: NotificationIdParamsType;
}) => {
  return markNotificationReadService(params.id);
};

export const markAllNotificationsRead = async () => {
  return markAllNotificationsReadService();
};

export const deleteNotification = async ({
  params,
}: {
  params: NotificationIdParamsType;
}) => {
  return deleteNotificationService(params.id);
};
