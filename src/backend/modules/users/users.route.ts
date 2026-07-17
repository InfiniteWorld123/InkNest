import { Elysia } from "elysia";
import {
	getCurrentUser,
	getUserByUsername,
	updateCurrentUser,
} from "./users.controller";

export const usersRoutes = new Elysia({ prefix: "/users" })
	.get("/me", getCurrentUser)
	.patch("/me", updateCurrentUser)
	.get("/:username", getUserByUsername);
