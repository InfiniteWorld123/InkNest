import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import { getErrorMessage } from "../utils";

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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
		onError: (error) => {
			console.log(error.message);
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
		onError: (error) => {
			console.log(error.message);
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};
