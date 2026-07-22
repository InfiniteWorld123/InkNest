import { responseOk } from "#/backend/shared/response";
import type {
	AuthenticatedUser,
	GetUserByUsernameParams,
	ListUsersQuery,
	UpdateCurrentUserBody,
} from "#/shared/types/users.type";
import {
	getCurrentUserService,
	getUserByUsernameService,
	listUsersService,
	updateCurrentUserService,
} from "./users.service";

export const listUsers = async ({ query }: { query: ListUsersQuery }) => {
	const data = await listUsersService(query);

	return responseOk({ data, message: "Users retrieved successfully" });
};

export const getCurrentUser = async ({ user }: { user: AuthenticatedUser }) => {
	const data = await getCurrentUserService(user.id);

	return responseOk({ data, message: "User retrieved successfully" });
};

export const updateCurrentUser = async ({
	user,
	body,
}: {
	user: AuthenticatedUser;
	body: UpdateCurrentUserBody;
}) => {
	const data = await updateCurrentUserService({
		userId: user.id,
		body,
	});

	return responseOk({ data, message: "User updated successfully" });
};

export const getUserByUsername = async ({
	params,
}: {
	params: GetUserByUsernameParams;
}) => {
	const data = await getUserByUsernameService(params.username);

	return responseOk({ data, message: "User retrieved successfully" });
};
