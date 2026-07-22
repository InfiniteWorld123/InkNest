import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import { getErrorMessage } from "../utils";

export type NotificationItem = {
	id: number;
	userId: string;
	actorId: string | null;
	postId: number | null;
	commentId: number | null;
	type: string;
	isRead: boolean;
	createdAt: string | Date;
};

export const notificationKeys = {
	all: ["notifications"] as const,
	lists: () => [...notificationKeys.all, "list"] as const,
};

export const listNotificationsQueryOptions = () =>
	queryOptions({
		queryKey: notificationKeys.lists(),
		queryFn: async () => {
			const result = await safe_API().notifications.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load notifications"),
				);
			}

			return result.data;
		},
	});

export const markNotificationReadMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id }: { id: number }) => {
			const result = await safe_API().notifications({ id }).read.patch();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to mark notification as read"),
				);
			}

			return result.data;
		},
		onMutate: async ({ id }) => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

			const previousNotifications = queryClient.getQueryData<
				NotificationItem[]
			>(notificationKeys.lists());

			queryClient.setQueryData<NotificationItem[]>(
				notificationKeys.lists(),
				(old) =>
					old?.map((notification) =>
						notification.id === id
							? { ...notification, isRead: true }
							: notification,
					),
			);

			return { previousNotifications };
		},
		onError: (error, _variables, context) => {
			if (context?.previousNotifications) {
				queryClient.setQueryData(
					notificationKeys.lists(),
					context.previousNotifications,
				);
			}

			console.log(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
	});
};

export const markAllNotificationsReadMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await safe_API().notifications["read-all"].patch();

			if (result.error) {
				throw new Error(
					getErrorMessage(
						result.error,
						"Unable to mark all notifications as read",
					),
				);
			}

			return result.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

			const previousNotifications = queryClient.getQueryData<
				NotificationItem[]
			>(notificationKeys.lists());

			queryClient.setQueryData<NotificationItem[]>(
				notificationKeys.lists(),
				(old) =>
					old?.map((notification) => ({ ...notification, isRead: true })),
			);

			return { previousNotifications };
		},
		onError: (error, _variables, context) => {
			if (context?.previousNotifications) {
				queryClient.setQueryData(
					notificationKeys.lists(),
					context.previousNotifications,
				);
			}

			console.log(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
	});
};

export const deleteNotificationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id }: { id: number }) => {
			const result = await safe_API().notifications({ id }).delete();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to delete notification"),
				);
			}

			return result.data;
		},
		onMutate: async ({ id }) => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

			const previousNotifications = queryClient.getQueryData<
				NotificationItem[]
			>(notificationKeys.lists());

			queryClient.setQueryData<NotificationItem[]>(
				notificationKeys.lists(),
				(old) => old?.filter((notification) => notification.id !== id),
			);

			return { previousNotifications };
		},
		onError: (error, _variables, context) => {
			if (context?.previousNotifications) {
				queryClient.setQueryData(
					notificationKeys.lists(),
					context.previousNotifications,
				);
			}

			console.log(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
	});
};
