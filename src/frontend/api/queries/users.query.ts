import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type { UpdateCurrentUserBody } from "#/shared/types/users.type";
import { getErrorMessage } from "../utils";

export const userKeys = {
	all: ["users"] as const,
	me: () => [...userKeys.all, "me"] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (username: string) => [...userKeys.details(), username] as const,
};

export const currentUserQueryOptions = () =>
	queryOptions({
		queryKey: userKeys.me(),
		queryFn: async () => {
			const result = await safe_API().users.me.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load your profile"),
				);
			}

			return result.data;
		},
	});

export const userByUsernameQueryOptions = (username: string) =>
	queryOptions({
		queryKey: userKeys.detail(username),
		queryFn: async () => {
			const result = await safe_API().users({ username }).get();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load user"));
			}

			return result.data;
		},
	});

export const updateCurrentUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: UpdateCurrentUserBody) => {
			const result = await safe_API().users.me.patch(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to update profile"),
				);
			}

			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.me() });
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};
