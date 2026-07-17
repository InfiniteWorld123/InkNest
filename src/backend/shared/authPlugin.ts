import Elysia from "elysia";
import * as v from "valibot";
import { AuthenticatedUserSchema } from "#/shared/validation/users.validation";
import { auth } from "./auth";
import { unauthorizedError } from "./error";

export const authPlugin = new Elysia({ name: "auth-plugin" }).macro({
	auth: {
		async resolve({ request }) {
			const session = await auth.api.getSession({
				headers: request.headers,
			});

			if (!session) {
				throw unauthorizedError();
			}

			const user = v.parse(AuthenticatedUserSchema, session.user);

			return {
				user,
				session: session.session,
			};
		},
	},
	optionalAuth: {
		async resolve({ request }) {
			const session = await auth.api.getSession({
				headers: request.headers,
			});

			if (!session) {
				return {
					user: null,
					session: null,
				};
			}

			const user = v.parse(AuthenticatedUserSchema, session.user);

			return {
				user,
				session: session.session,
			};
		},
	},
});
