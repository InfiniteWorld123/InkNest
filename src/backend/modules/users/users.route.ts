import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
import {
	GetUserByUsernameParamsSchema,
	ListUsersQuerySchema,
	UpdateCurrentUserBodySchema,
} from "#/shared/validation/users.validation";
import {
	getCurrentUser,
	getUserByUsername,
	listUsers,
	updateCurrentUser,
} from "./users.controller";

export const usersRoutes = new Elysia({ prefix: "/users" })
	.use(authPlugin)
	.guard({ auth: true }, (app) =>
		app.get("/me", getCurrentUser).patch("/me", updateCurrentUser, {
			body: UpdateCurrentUserBodySchema,
		}),
	)
	.get("/", listUsers, { query: ListUsersQuerySchema })
	.get("/:username", getUserByUsername, {
		params: GetUserByUsernameParamsSchema,
	});
