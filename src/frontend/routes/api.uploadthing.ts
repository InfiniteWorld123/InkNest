import { createFileRoute } from "@tanstack/react-router";
import { handleUploadThingRequest } from "#/backend/modules/uploads/uploadthing";

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
