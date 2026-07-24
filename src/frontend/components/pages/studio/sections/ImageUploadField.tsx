import { Alert, Button, ProgressBar, Surface } from "@heroui/react";
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useUploadThing } from "#/frontend/api/uploadthing";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

type ImageUploadFieldProps = {
	value: string | null;
	onChange: (value: string | null) => void;
	onBlur?: () => void;
	onUploadingChange?: (isUploading: boolean) => void;
	isDisabled?: boolean;
};

export function ImageUploadField({
	value,
	onChange,
	onBlur,
	onUploadingChange,
	isDisabled = false,
}: ImageUploadFieldProps) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const { startUpload, isUploading } = useUploadThing("coverImage", {
		uploadProgressGranularity: "fine",
		onUploadProgress: setUploadProgress,
		onUploadError: (error) => {
			setUploadError(error.message || "Unable to upload this image");
		},
		onClientUploadComplete: (files) => {
			const uploadedImage = files[0];

			if (!uploadedImage) {
				setUploadError("Upload finished without an image URL");
				return;
			}

			onChange(uploadedImage.ufsUrl);
			setUploadProgress(100);
			setUploadError(null);
			onBlur?.();
		},
	});

	useEffect(() => {
		onUploadingChange?.(isUploading);
	}, [isUploading, onUploadingChange]);

	useEffect(() => {
		setLocalPreviewUrl(null);
		setSelectedFile(null);
		setUploadProgress(value ? 100 : 0);
	}, [value]);

	useEffect(
		() => () => {
			if (localPreviewUrl) {
				URL.revokeObjectURL(localPreviewUrl);
			}
		},
		[localPreviewUrl],
	);

	const previewUrl = localPreviewUrl ?? value;

	const uploadFile = async (file: File) => {
		setUploadError(null);

		if (!file.type.startsWith("image/")) {
			setUploadError("Choose an image file");
			return;
		}

		if (file.size > MAX_IMAGE_SIZE) {
			setUploadError("The cover image must be 4 MB or smaller");
			return;
		}

		setSelectedFile(file);
		setLocalPreviewUrl(URL.createObjectURL(file));
		setUploadProgress(0);

		try {
			await startUpload([file]);
		} catch (error) {
			setUploadError(
				error instanceof Error ? error.message : "Unable to upload this image",
			);
		}
	};

	const handleSelection = (files: FileList | null) => {
		const file = files?.[0];

		if (file) {
			void uploadFile(file);
		}
	};

	const removeImage = () => {
		setSelectedFile(null);
		setLocalPreviewUrl(null);
		setUploadError(null);
		setUploadProgress(0);
		onChange(null);
		onBlur?.();

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	return (
		<div className="space-y-3">
			<Surface
				className="rounded-xl border border-dashed border-accent-300 bg-accent-50/60 p-4 dark:border-accent-800 dark:bg-accent-500/5"
				onDragOver={(event) => event.preventDefault()}
				onDrop={(event) => {
					event.preventDefault();

					if (!isDisabled && !isUploading) {
						handleSelection(event.dataTransfer.files);
					}
				}}
			>
				<input
					ref={inputRef}
					id={inputId}
					type="file"
					accept="image/*"
					disabled={isDisabled || isUploading}
					onChange={(event) => handleSelection(event.target.files)}
					className="sr-only"
					aria-label="Choose a cover image"
				/>

				{previewUrl ? (
					<div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
						<img
							src={previewUrl}
							alt="Cover preview"
							className="aspect-[16/9] w-full object-cover"
						/>
						<div className="flex flex-wrap items-center justify-between gap-3 p-3">
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
									{selectedFile?.name ?? "Current cover image"}
								</p>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									{isUploading
										? `Uploading… ${uploadProgress}%`
										: value
											? "Uploaded and ready to save"
											: "Previewing selected image"}
								</p>
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									size="sm"
									variant="secondary"
									isDisabled={isDisabled || isUploading}
									onPress={() => inputRef.current?.click()}
								>
									<RefreshCw size={15} aria-hidden="true" />
									Replace
								</Button>
								<Button
									type="button"
									size="sm"
									variant="danger-soft"
									isDisabled={isDisabled || isUploading}
									onPress={removeImage}
								>
									<Trash2 size={15} aria-hidden="true" />
									Remove
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div className="px-3 py-6 text-center">
						<span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent-600 shadow-sm dark:bg-slate-900 dark:text-accent-400">
							<ImagePlus size={23} aria-hidden="true" />
						</span>
						<p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
							Choose or drop a cover image
						</p>
						<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
							One image, up to 4 MB
						</p>
						<Button
							type="button"
							size="sm"
							className="mt-4"
							isDisabled={isDisabled || isUploading}
							onPress={() => inputRef.current?.click()}
						>
							<UploadCloud size={16} aria-hidden="true" />
							Choose image
						</Button>
					</div>
				)}

				{isUploading ? (
					<ProgressBar
						aria-label="Cover image upload progress"
						value={uploadProgress}
						className="mt-3"
					>
						<ProgressBar.Track>
							<ProgressBar.Fill />
						</ProgressBar.Track>
					</ProgressBar>
				) : null}
			</Surface>

			{uploadError ? (
				<Alert status="danger">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Image upload failed</Alert.Title>
						<Alert.Description>{uploadError}</Alert.Description>
						{selectedFile ? (
							<Button
								type="button"
								size="sm"
								variant="danger"
								onPress={() => void uploadFile(selectedFile)}
								className="mt-3"
							>
								Try upload again
							</Button>
						) : null}
					</Alert.Content>
				</Alert>
			) : null}
		</div>
	);
}
