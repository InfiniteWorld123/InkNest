import { generateUploadDropzone } from "@uploadthing/react";
import type { UploadRouter } from "#/backend/modules/uploads/uploadthing";

export const UploadDropzone = generateUploadDropzone<UploadRouter>();
