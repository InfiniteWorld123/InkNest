import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "#/backend/modules/uploads/uploadthing";

export const { useUploadThing } = generateReactHelpers<UploadRouter>({
	url: "/api/uploadthing",
});
