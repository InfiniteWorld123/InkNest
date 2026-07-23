import { Chip, Surface } from "@heroui/react";
import { ImagePlus } from "lucide-react";

export function ImageUploadField() {
	return (
		<div className="space-y-3">
			<Surface className="rounded-xl border border-dashed border-accent-300 bg-accent-50/60 px-5 py-7 text-center dark:border-accent-800 dark:bg-accent-500/5">
				<span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent-600 shadow-sm dark:bg-slate-900 dark:text-accent-400">
					<ImagePlus size={23} aria-hidden="true" />
				</span>
				<p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
					Choose or drop a cover image
				</p>
				<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
					One image, up to 4 MB
				</p>

				<input
					type="file"
					name="coverImage"
					accept="image/*"
					aria-label="Choose a cover image"
					className="mx-auto mt-4 block max-w-full text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-accent-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-700 dark:text-slate-300"
				/>
				<p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
					After you choose an image, its file name is shown above.
				</p>
			</Surface>

			<Surface className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
				<div className="flex min-w-0 items-center gap-3">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
						<ImagePlus size={18} aria-hidden="true" />
					</span>
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
							Your selected image will appear here
						</p>
						<p className="text-xs text-slate-500 dark:text-slate-400">
							Static UI — no file is uploaded
						</p>
					</div>
				</div>
				<Chip variant="soft" size="sm">
					<Chip.Label>UI only</Chip.Label>
				</Chip>
			</Surface>

			{/*
				BACKEND CONNECTION:
				1. Add an UploadThing imageUploader FileRouter on the server.
				2. Mount it at /api/uploadthing.
				3. Replace this static field with UploadThing's UploadDropzone.
				4. onClientUploadComplete gives you the uploaded image URL.
				5. Put that URL in the post form's image field.
			*/}
		</div>
	);
}
