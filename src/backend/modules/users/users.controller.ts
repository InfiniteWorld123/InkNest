import type {
	AuthenticatedUserType,
	GetUserByUsernameParamsType,
	UpdateCurrentUserBodyType,
} from "#/shared/types/users.type";
import {
	getCurrentUserService,
	getUserByUsernameService,
	updateCurrentUserService,
} from "./users.service";

export const getCurrentUser = async ({
	user,
}: {
	user: AuthenticatedUserType;
}) => {
	return getCurrentUserService(user.id);
};

export const updateCurrentUser = async ({
	user,
	body,
}: {
	user: AuthenticatedUserType;
	body: UpdateCurrentUserBodyType;
}) => {
	return updateCurrentUserService({
		userId: user.id,
		body,
	});
};

export const getUserByUsername = async ({
	params,
}: {
	params: GetUserByUsernameParamsType;
}) => {
	return getUserByUsernameService(params.username);
};
