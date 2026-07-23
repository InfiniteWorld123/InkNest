import {
	Alert,
	Button,
	Card,
	Description,
	Form,
	Input,
	Label,
	ListBox,
	Select,
	TextField,
} from "@heroui/react";
import type { JSONContent } from "@tiptap/core";
import { PenLine, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import * as v from "valibot";
import {
	createPostMutation,
	type OwnPost,
	updatePostMutation,
} from "#/frontend/api/queries/post.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import {
	emptyTiptapDocument,
	postContentToTiptapDocument,
	tiptapDocumentHasText,
} from "#/frontend/components/shared/tiptapContent";
import {
	CreatePostBodySchema,
	UpdatePostBodySchema,
} from "#/shared/validation/post.validation";
import { ImageUploadField } from "./ImageUploadField";
import { RichTextEditor } from "./RichTextEditor";

type CreatePostSectionProps = {
	post?: OwnPost | null;
	onCancelEdit: () => void;
	onSaved: () => void;
};

const toDateTimeLocal = (value: string | Date | null): string => {
	if (!value) return "";

	const date = new Date(value);
	const localTime = new Date(
		date.getTime() - date.getTimezoneOffset() * 60_000,
	);

	return localTime.toISOString().slice(0, 16);
};

export function CreatePostSection({
	post,
	onCancelEdit,
	onSaved,
}: CreatePostSectionProps) {
	const initialDocument = useMemo(
		() =>
			post ? postContentToTiptapDocument(post.content) : emptyTiptapDocument(),
		[post],
	);
	const createPost = createPostMutation();
	const updatePost = updatePostMutation();
	const [document, setDocument] = useState<JSONContent>(initialDocument);
	const [isContentEmpty, setIsContentEmpty] = useState(
		!tiptapDocumentHasText(initialDocument),
	);
	const [imageUrl, setImageUrl] = useState<string | null>(post?.image ?? null);
	const [editorRevision, setEditorRevision] = useState(0);
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const isEditing = Boolean(post);
	const isPending = createPost.isPending || updatePost.isPending;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const publishedAtValue = String(formData.get("publishedAt") ?? "").trim();

		if (isContentEmpty) {
			setSuccessMessage(null);
			setFormError("Please write your story before saving it.");
			return;
		}

		/*
		 * Tiptap produces an object. The posts table stores content as a string, so
		 * this is the one conversion needed before POST or PATCH sends the body.
		 */
		const rawBody = {
			title: String(formData.get("title") ?? ""),
			slug: String(formData.get("slug") ?? ""),
			image: imageUrl,
			content: JSON.stringify(document),
			status: String(formData.get("status") ?? post?.status ?? "draft"),
			publishedAt: publishedAtValue
				? new Date(publishedAtValue).toISOString()
				: null,
		};
		setFormError(null);
		setSuccessMessage(null);

		try {
			if (post) {
				const validation = v.safeParse(UpdatePostBodySchema, rawBody);

				if (!validation.success) {
					setFormError(
						validation.issues[0]?.message ?? "Please check the form.",
					);
					return;
				}

				// This sends PATCH /api/posts/:postId through the shared mutation.
				await updatePost.mutateAsync({
					postId: post.id,
					body: validation.output,
				});
				onSaved();
				return;
			}

			const validation = v.safeParse(CreatePostBodySchema, rawBody);

			if (!validation.success) {
				setFormError(validation.issues[0]?.message ?? "Please check the form.");
				return;
			}

			// This sends POST /api/posts through the shared mutation.
			await createPost.mutateAsync(validation.output);
			form.reset();
			setDocument(emptyTiptapDocument());
			setIsContentEmpty(true);
			setImageUrl(null);
			setEditorRevision((revision) => revision + 1);
			setSuccessMessage("Your post was created.");
			onSaved();
		} catch (error) {
			setFormError(
				getCaughtErrorMessage(
					error,
					isEditing
						? "Unable to save your post."
						: "Unable to create your post.",
				),
			);
		}
	};

	return (
		<Card className="self-start overflow-hidden xl:sticky xl:top-24">
			<Card.Header className="border-b border-slate-200 p-6 dark:border-slate-800">
				<div>
					<Card.Title>{isEditing ? "Edit post" : "New post"}</Card.Title>
					<Card.Description className="mt-1">
						{isEditing
							? "Update the story, cover, date, or publishing status."
							: "Give your next idea a place to grow."}
					</Card.Description>
				</div>
			</Card.Header>

			<Card.Content className="p-6">
				<Form
					className="flex flex-col gap-5"
					aria-label={isEditing ? "Edit post" : "Create a new post"}
					onSubmit={handleSubmit}
				>
					{formError ? (
						<Alert status="danger">
							<Alert.Indicator />
							<Alert.Content>
								<Alert.Title>Could not save the post</Alert.Title>
								<Alert.Description>{formError}</Alert.Description>
							</Alert.Content>
						</Alert>
					) : null}

					{successMessage ? (
						<Alert status="success">
							<Alert.Indicator />
							<Alert.Content>
								<Alert.Title>Post saved</Alert.Title>
								<Alert.Description>{successMessage}</Alert.Description>
							</Alert.Content>
						</Alert>
					) : null}

					<TextField fullWidth isRequired>
						<Label>Title</Label>
						<Input
							name="title"
							placeholder="A story worth sharing"
							defaultValue={post?.title}
							maxLength={200}
						/>
					</TextField>

					<TextField fullWidth isRequired>
						<Label>Slug</Label>
						<Input
							name="slug"
							placeholder="a-story-worth-sharing"
							defaultValue={post?.slug}
						/>
						<Description>
							Use lowercase words and hyphens. This becomes the post address.
						</Description>
					</TextField>

					<div>
						<Label className="mb-2 block">Cover image</Label>
						<ImageUploadField
							value={imageUrl}
							onChange={setImageUrl}
							isDisabled={isPending}
						/>
					</div>

					<div className="grid gap-5 sm:grid-cols-2">
						<Select
							name="status"
							defaultSelectedKey={post?.status ?? "draft"}
							placeholder="Choose a status"
							fullWidth
						>
							<Label>Status</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									<ListBox.Item id="draft" textValue="Draft">
										Draft
										<ListBox.ItemIndicator />
									</ListBox.Item>
									<ListBox.Item id="published" textValue="Published">
										Published
										<ListBox.ItemIndicator />
									</ListBox.Item>
									<ListBox.Item id="archived" textValue="Archived">
										Archived
										<ListBox.ItemIndicator />
									</ListBox.Item>
								</ListBox>
							</Select.Popover>
						</Select>

						<TextField fullWidth>
							<Label>Publish date</Label>
							<Input
								name="publishedAt"
								type="datetime-local"
								defaultValue={toDateTimeLocal(post?.publishedAt ?? null)}
							/>
						</TextField>
					</div>

					<div>
						<Label className="mb-2 block">Story content</Label>
						<RichTextEditor
							key={editorRevision}
							initialContent={initialDocument}
							isDisabled={isPending}
							onChange={(nextDocument, empty) => {
								setDocument(nextDocument);
								setIsContentEmpty(empty);
							}}
						/>
					</div>

					<div className="flex flex-col gap-2 sm:flex-row">
						<Button
							type="submit"
							fullWidth
							isDisabled={isPending}
							isPending={isPending}
						>
							<PenLine size={17} aria-hidden="true" />
							{isPending
								? "Saving…"
								: isEditing
									? "Save changes"
									: "Create post"}
						</Button>
						{isEditing ? (
							<Button
								type="button"
								variant="secondary"
								isDisabled={isPending}
								onPress={onCancelEdit}
							>
								<X size={17} aria-hidden="true" />
								Cancel
							</Button>
						) : null}
					</div>
				</Form>
			</Card.Content>
		</Card>
	);
}
