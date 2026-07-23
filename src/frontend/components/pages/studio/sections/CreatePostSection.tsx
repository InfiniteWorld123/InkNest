import {
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
import { PenLine } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";
import { RichTextEditor } from "./RichTextEditor";

export function CreatePostSection() {
	return (
		<Card className="self-start overflow-hidden xl:sticky xl:top-24">
			<Card.Header className="border-b border-slate-200 p-6 dark:border-slate-800">
				<div>
					<Card.Title>New post</Card.Title>
					<Card.Description className="mt-1">
						Give your next idea a place to grow.
					</Card.Description>
				</div>
			</Card.Header>

			<Card.Content className="p-6">
				<Form className="flex flex-col gap-5" aria-label="Create a new post">
					<TextField fullWidth isRequired>
						<Label>Title</Label>
						<Input name="title" placeholder="A story worth sharing" />
					</TextField>

					<TextField fullWidth isRequired>
						<Label>Slug</Label>
						<Input name="slug" placeholder="a-story-worth-sharing" />
						<Description>
							Use lowercase words and hyphens. This becomes the post address.
						</Description>
					</TextField>

					<div>
						<Label className="mb-2 block">Cover image</Label>
						<ImageUploadField />
					</div>

					<div className="grid gap-5 sm:grid-cols-2">
						<Select
							name="status"
							defaultSelectedKey="draft"
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
							<Input name="publishedAt" type="datetime-local" />
						</TextField>
					</div>

					<div>
						<Label className="mb-2 block">Story content</Label>
						<RichTextEditor />
					</div>

					{/*
						BACKEND CONNECTION:
						- Add an onSubmit function to this Form.
						- Read the title, slug, status, date, and image from FormData.
						- Read the editor with editor.getJSON().
						- Use JSON.stringify(editor.getJSON()) for the backend content string.
						- Send the data to POST /api/posts.
						- Refresh GET /api/users/me/posts after a successful request.
					*/}
					<Button type="button" fullWidth>
						<PenLine size={17} aria-hidden="true" />
						Create post
					</Button>
					<Description className="text-center">
						Demo only. This button does not save anything.
					</Description>
				</Form>
			</Card.Content>
		</Card>
	);
}
