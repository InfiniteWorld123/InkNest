import { treaty } from "@elysia/eden";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { type App, app, handleApiRequest } from "#/backend/app";

const handle = ({ request }: { request: Request }) => handleApiRequest(request);

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			GET: handle,
			POST: handle,
			PUT: handle,
			DELETE: handle,
			PATCH: handle,
		},
	},
});

export const safe_API = createIsomorphicFn()
	.server(() => treaty(app).api)
	.client(() => treaty<App>(window.location.origin).api);
