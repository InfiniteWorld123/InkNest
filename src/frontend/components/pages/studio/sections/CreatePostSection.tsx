import {
	Alert,
	Button,
	Card,
	Description,
	FieldError,
	Form,
	Input,
	Label,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { PenLine, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as v from "valibot";
import {
	createPostMutation,
	type OwnPost,
	updatePostMutation,
} from "#/frontend/api/queries/post.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { Select } from "#/frontend/components/shared/ui/Select";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import {
	EMPTY_POST_CONTENT,
	normalizePostContentForEditor,
} from "#/shared/post-content";
import type { CreatePostBody } from "#/shared/types/post.type";
import {
	PostContentSchema,
	PostImageSchema,
	PostStatusSchema,
	PostTitleSchema,
} from "#/shared/validation/post.validation";
import { SlugSchema } from "#/shared/validation/taxonomy.validation";
import { ImageUploadField } from "./ImageUploadField";
import { RichTextEditor } from "./RichTextEditor";

type StudioPostFormValues = {
	title: string;
	slug: string;
	image: string | null;
	content: string;
	status: "draft" | "published" | "archived";
	publishedAt: Date | null;
};

const StudioPostFormSchema = v.object({
	title: PostTitleSchema,
	slug: SlugSchema,
	image: v.nullable(PostImageSchema),
	content: PostContentSchema,
	status: PostStatusSchema,
	publishedAt: v.nullable(v.date("Publish date must be valid")),
});

const emptyFormValues: StudioPostFormValues = {
	title: "",
	slug: "",
	image: null,
	content: EMPTY_POST_CONTENT,
	status: "draft",
	publishedAt: null,
};

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 120)
		.replace(/-+$/g, "");

const toDateTimeLocalValue = (date: Date | null) => {
	if (!date || Number.isNaN(date.getTime())) {
		return "";
	}

	const localDate = new Date(
		date.getTime() - date.getTimezoneOffset() * 60_000,
	);
	return localDate.toISOString().slice(0, 16);
};

const toFormValues = (post: OwnPost | null): StudioPostFormValues => {
	if (!post) {
		return emptyFormValues;
	}

	return {
		title: post.title,
		slug: post.slug,
		image: post.image,
		content: normalizePostContentForEditor(post.content),
		status: post.status,
		publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
	};
};

const fieldMessages = (errors: Array<{ message?: string } | undefined>) =>
	errors.map((error) => error?.message).filter(Boolean) as string[];

type CreatePostSectionProps = {
	editingPost: OwnPost | null;
	onCancelEdit: () => void;
};

export function CreatePostSection({
	editingPost,
	onCancelEdit,
}: CreatePostSectionProps) {
	const createPost = createPostMutation();
	const updatePost = updatePostMutation();
	const [submissionError, setSubmissionError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isImageUploading, setIsImageUploading] = useState(false);
	const isEditing = editingPost !== null;
	const isSaving = createPost.isPending || updatePost.isPending;

	const form = useForm({
		defaultValues: toFormValues(editingPost),
		validators: {
			onChange: StudioPostFormSchema,
		},
		onSubmit: async ({ value }) => {
			setSubmissionError(null);
			setSuccessMessage(null);

			const body: CreatePostBody = value;

			try {
				if (editingPost) {
					await updatePost.mutateAsync({
						postId: editingPost.id,
						body,
					});
					form.reset(emptyFormValues);
					onCancelEdit();
					setSuccessMessage("Your changes were saved.");
				} else {
					await createPost.mutateAsync(body);
					form.reset(emptyFormValues);
					setSuccessMessage(
						value.status === "published"
							? "Your story is now published."
							: "Your story was saved.",
					);
				}
			} catch (error) {
				setSubmissionError(
					getCaughtErrorMessage(
						error,
						isEditing
							? "Unable to save your changes."
							: "Unable to create your post.",
					),
				);
			}
		},
	});

	useEffect(() => {
		form.reset(toFormValues(editingPost));
		setSubmissionError(null);
		if (editingPost) {
			setSuccessMessage(null);
		}
	}, [editingPost, form]);

	const cancelEditing = () => {
		form.reset(emptyFormValues);
		setSubmissionError(null);
		setSuccessMessage(null);
		onCancelEdit();
	};

	return (
		<Card
			id="studio-editor"
			className="self-start overflow-hidden xl:sticky xl:top-24"
		>
			<Card.Header className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
				<div>
					<Card.Title>{isEditing ? "Edit post" : "New post"}</Card.Title>
					<Card.Description className="mt-1">
						{isEditing
							? `Updating “${editingPost.title}”.`
							: "Give your next idea a place to grow."}
					</Card.Description>
				</div>
				{isEditing ? (
					<Button
						type="button"
						size="sm"
						variant="ghost"
						isDisabled={isSaving}
						onPress={cancelEditing}
					>
						<X size={16} aria-hidden="true" />
						Cancel
					</Button>
				) : null}
			</Card.Header>

			<Card.Content className="p-6">
				{successMessage ? (
					<Alert status="success" className="mb-5">
						<Alert.Indicator />
						<Alert.Content>
							<Alert.Title>Saved</Alert.Title>
							<Alert.Description>{successMessage}</Alert.Description>
						</Alert.Content>
					</Alert>
				) : null}

				{submissionError ? (
					<Alert status="danger" className="mb-5">
						<Alert.Indicator />
						<Alert.Content>
							<Alert.Title>Could not save post</Alert.Title>
							<Alert.Description>{submissionError}</Alert.Description>
						</Alert.Content>
					</Alert>
				) : null}

				<Form
					className="flex flex-col gap-5"
					aria-label={isEditing ? "Edit post" : "Create a new post"}
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<form.Field name="title">
						{(field) => (
							<TextField
								label="Title"
								name={field.name}
								placeholder="A story worth sharing"
								value={field.state.value}
								onChange={(event) => {
									const previousAutoSlug = slugify(field.state.value);
									const nextTitle = event.target.value;
									const currentSlug = form.getFieldValue("slug");

									field.handleChange(nextTitle);

									if (currentSlug === "" || currentSlug === previousAutoSlug) {
										form.setFieldValue("slug", slugify(nextTitle));
									}
								}}
								onBlur={field.handleBlur}
								disabled={isSaving}
								required
								errors={
									field.state.meta.isTouched
										? fieldMessages(field.state.meta.errors)
										: []
								}
							/>
						)}
					</form.Field>

					<form.Field name="slug">
						{(field) => (
							<TextField
								label="Slug"
								name={field.name}
								placeholder="a-story-worth-sharing"
								hint="Use lowercase words and hyphens. This becomes the post address."
								value={field.state.value}
								onChange={(event) => field.handleChange(event.target.value)}
								onBlur={field.handleBlur}
								disabled={isSaving}
								required
								errors={
									field.state.meta.isTouched
										? fieldMessages(field.state.meta.errors)
										: []
								}
							/>
						)}
					</form.Field>

					<form.Field name="image">
						{(field) => (
							<div>
								<Label className="mb-2 block">Cover image</Label>
								<ImageUploadField
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									onUploadingChange={setIsImageUploading}
									isDisabled={isSaving}
								/>
								{field.state.meta.isTouched &&
								field.state.meta.errors.length > 0 ? (
									<FieldError>
										{fieldMessages(field.state.meta.errors)[0]}
									</FieldError>
								) : null}
							</div>
						)}
					</form.Field>

					<div className="grid gap-5 sm:grid-cols-2">
						<form.Field name="status">
							{(field) => (
								<Select
									name={field.name}
									label="Status"
									value={field.state.value}
									onValueChange={(status) =>
										field.handleChange(status as StudioPostFormValues["status"])
									}
									onBlur={field.handleBlur}
									isDisabled={isSaving}
									options={[
										{ value: "draft", label: "Draft" },
										{ value: "published", label: "Published" },
										{ value: "archived", label: "Archived" },
									]}
								/>
							)}
						</form.Field>

						<form.Field name="publishedAt">
							{(field) => (
								<div>
									<Label htmlFor="studio-published-at">Publish date</Label>
									<Input
										id="studio-published-at"
										name={field.name}
										type="datetime-local"
										value={toDateTimeLocalValue(field.state.value)}
										onChange={(event) =>
											field.handleChange(
												event.target.value
													? new Date(event.target.value)
													: null,
											)
										}
										onBlur={field.handleBlur}
										disabled={isSaving}
										aria-invalid={
											field.state.meta.isTouched &&
											field.state.meta.errors.length > 0
										}
									/>
									<Description>Leave empty to publish immediately.</Description>
									{field.state.meta.isTouched &&
									field.state.meta.errors.length > 0 ? (
										<FieldError>
											{fieldMessages(field.state.meta.errors)[0]}
										</FieldError>
									) : null}
								</div>
							)}
						</form.Field>
					</div>

					<form.Field name="content">
						{(field) => {
							const messages = fieldMessages(field.state.meta.errors);
							const showError =
								field.state.meta.isTouched && messages.length > 0;

							return (
								<div>
									<Label className="mb-2 block">Story content</Label>
									<RichTextEditor
										value={field.state.value}
										onChange={field.handleChange}
										onBlur={field.handleBlur}
										isDisabled={isSaving}
										isInvalid={showError}
									/>
									{showError ? <FieldError>{messages[0]}</FieldError> : null}
								</div>
							);
						}}
					</form.Field>

					<Button
						type="submit"
						fullWidth
						isDisabled={isSaving || isImageUploading}
						isPending={isSaving}
					>
						{isEditing ? (
							<Save size={17} aria-hidden="true" />
						) : (
							<PenLine size={17} aria-hidden="true" />
						)}
						{isSaving
							? "Saving…"
							: isImageUploading
								? "Waiting for image upload…"
								: isEditing
									? "Save changes"
									: "Create post"}
					</Button>
				</Form>
			</Card.Content>
		</Card>
	);
}
