import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
import {
	GetUserByUsernameParamsSchema,
	UpdateCurrentUserBodySchema,
} from "#/shared/validation/users.validation";
import {
	getCurrentUser,
	getUserByUsername,
	updateCurrentUser,
} from "./users.controller";

export const usersRoutes = new Elysia({ prefix: "/users" })
	.use(authPlugin)
	.guard({ auth: true }, (app) =>
		app.get("/me", getCurrentUser).patch("/me", updateCurrentUser, {
			body: UpdateCurrentUserBodySchema,
		}),
	)
	.get("/:username", getUserByUsername, {
		params: GetUserByUsernameParamsSchema,
	});
