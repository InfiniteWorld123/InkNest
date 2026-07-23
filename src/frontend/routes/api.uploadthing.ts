import { createFileRoute } from "@tanstack/react-router";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "#/backend/modules/uploads/uploadthing";
import { env } from "#/shared/env";

const handleUploadThingRequest = createRouteHandler({
	router: uploadRouter,
	config: {
		token: env.UPLOADTHING_TOKEN,
	},
});

const handle = ({ request }: { request: Request }) =>
	handleUploadThingRequest(request);

export const Route = createFileRoute("/api/uploadthing")({
	server: {
		handlers: {
			GET: handle,
			POST: handle,
		},
	},
});
