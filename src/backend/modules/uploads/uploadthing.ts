import {
	createUploadthing,
	type FileRouter,
	UploadThingError,
} from "uploadthing/server";
import { auth } from "#/backend/shared/auth";

const upload = createUploadthing();

export const uploadRouter = {
	imageUploader: upload({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const session = await auth.api.getSession({ headers: req.headers });

			if (!session) {
				throw new UploadThingError("You must be signed in to upload images");
			}

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => ({
			uploadedBy: metadata.userId,
			imageUrl: file.ufsUrl,
		})),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
