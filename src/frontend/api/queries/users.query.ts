import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type {
	ListUsersQuery,
	UpdateCurrentUserBody,
} from "#/shared/types/users.type";
import { getErrorMessage } from "../utils";

export type CurrentUser = {
	id: string;
	name: string;
	username: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	bio: string | null;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export type PublicUser = {
	id: string;
	name: string;
	username: string;
	image: string | null;
	bio: string | null;
	createdAt: string | Date;
};

export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (query: ListUsersQuery) => [...userKeys.lists(), query] as const,
	me: () => [...userKeys.all, "me"] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (username: string) => [...userKeys.details(), username] as const,
};

export const listUsersQueryOptions = (query: ListUsersQuery = {}) =>
	queryOptions({
		queryKey: userKeys.list(query),
		staleTime: 30_000,
		queryFn: async () => {
			const result = await safe_API().users.get({ query });

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load users"));
			}

			return {
				...result.data,
				data: result.data.data as PublicUser[],
			};
		},
	});

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
		staleTime: 30_000,
		queryFn: async () => {
			const result = await safe_API().users({ username }).get();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load user"));
			}

			return {
				...result.data,
				data: result.data.data as PublicUser,
			};
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
		onMutate: async (body) => {
			await queryClient.cancelQueries({ queryKey: userKeys.me() });

			const previousUser = queryClient.getQueryData<CurrentUser>(userKeys.me());

			queryClient.setQueryData<CurrentUser>(userKeys.me(), (old) =>
				old ? { ...old, ...body, updatedAt: new Date() } : old,
			);

			return { previousUser };
		},
		onError: (error, _body, context) => {
			if (context?.previousUser) {
				queryClient.setQueryData(userKeys.me(), context.previousUser);
			}

			console.log(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.all });
		},
	});
};
