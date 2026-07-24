import {
	createRouteHandler,
	createUploadthing,
	type FileRouter,
	UploadThingError,
} from "uploadthing/server";
import { auth } from "#/backend/shared/auth";

const upload = createUploadthing();

export const uploadRouter = {
	coverImage: upload({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
			minFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const session = await auth.api.getSession({ headers: req.headers });

			if (!session) {
				throw new UploadThingError("Sign in to upload a cover image");
			}

			return { userId: session.user.id };
		})
		.onUploadComplete(({ file, metadata }) => ({
			uploadedBy: metadata.userId,
			url: file.ufsUrl,
		})),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

export const handleUploadThingRequest = createRouteHandler({
	router: uploadRouter,
});
