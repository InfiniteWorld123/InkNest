import { Alert, Button, Surface } from "@heroui/react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { UploadDropzone } from "#/frontend/api/uploadthing";

type ImageUploadFieldProps = {
	value: string | null;
	onChange: (url: string | null) => void;
	isDisabled?: boolean;
};

export function ImageUploadField({
	value,
	onChange,
	isDisabled = false,
}: ImageUploadFieldProps) {
	const [uploadError, setUploadError] = useState<string | null>(null);

	if (value) {
		return (
			<Surface className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
				<img
					src={value}
					alt="Current post cover"
					className="aspect-[16/9] w-full object-cover"
				/>
				<div className="flex items-center justify-between gap-3 p-3">
					<p className="min-w-0 truncate text-xs text-slate-500 dark:text-slate-400">
						Cover image uploaded
					</p>
					<Button
						type="button"
						variant="danger-soft"
						size="sm"
						isDisabled={isDisabled}
						onPress={() => onChange(null)}
					>
						<Trash2 size={15} aria-hidden="true" />
						Remove
					</Button>
				</div>
			</Surface>
		);
	}

	return (
		<div className="space-y-3">
			<UploadDropzone
				endpoint="imageUploader"
				disabled={isDisabled}
				onChange={() => setUploadError(null)}
				onClientUploadComplete={(files) => {
					const imageUrl = files[0]?.ufsUrl;

					if (imageUrl) {
						onChange(imageUrl);
						setUploadError(null);
					}
				}}
				onUploadError={(error) => setUploadError(error.message)}
				appearance={{
					container:
						"rounded-xl border border-dashed border-accent-300 bg-accent-50/60 px-5 py-7 dark:border-accent-800 dark:bg-accent-500/5",
					uploadIcon: "text-accent-600 dark:text-accent-400",
					label:
						"text-sm font-semibold text-slate-900 dark:text-white hover:text-accent-700",
					allowedContent: "text-xs text-slate-500 dark:text-slate-400",
					button:
						"rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white after:bg-accent-700 ut-uploading:cursor-wait",
				}}
				content={{
					uploadIcon: <ImagePlus size={28} aria-hidden="true" />,
					label: "Choose or drop a cover image",
					allowedContent: "One image, up to 4 MB",
					button: ({ isUploading }) =>
						isUploading ? "Uploading…" : "Upload image",
				}}
			/>

			{uploadError ? (
				<Alert status="danger">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Image upload failed</Alert.Title>
						<Alert.Description>{uploadError}</Alert.Description>
					</Alert.Content>
				</Alert>
			) : null}
		</div>
	);
}
