import { Button, Card, Chip, Table } from "@heroui/react";
import { Archive, FilePenLine, Send, Trash2 } from "lucide-react";

type ExamplePost = {
	id: number;
	title: string;
	slug: string;
	status: "draft" | "published" | "archived";
	updated: string;
	published: string;
};

const examplePosts: ExamplePost[] = [
	{
		id: 1,
		title: "A quieter way to write online",
		slug: "a-quieter-way-to-write-online",
		status: "published",
		updated: "Jul 21, 2026",
		published: "Jul 21, 2026",
	},
	{
		id: 2,
		title: "Notes from a slow Sunday",
		slug: "notes-from-a-slow-sunday",
		status: "draft",
		updated: "Jul 20, 2026",
		published: "Not published",
	},
	{
		id: 3,
		title: "Ideas I want to revisit",
		slug: "ideas-i-want-to-revisit",
		status: "archived",
		updated: "Jul 18, 2026",
		published: "Not published",
	},
];

const statusColor: Record<
	ExamplePost["status"],
	"default" | "success" | "warning"
> = {
	draft: "warning",
	published: "success",
	archived: "default",
};

export function PostManagementSection() {
	return (
		<Card className="min-w-0 overflow-hidden">
			<Card.Header className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
				<div>
					<Card.Title>Your posts</Card.Title>
					<Card.Description className="mt-1">
						Static examples for the future post dashboard.
					</Card.Description>
				</div>
				<Chip color="accent" variant="soft" size="sm">
					<Chip.Label>{examplePosts.length} stories</Chip.Label>
				</Chip>
			</Card.Header>

			<Card.Content className="p-0">
				{/*
					BACKEND CONNECTION:
					- Load this table with GET /api/users/me/posts.
					- Use PATCH /api/posts/:postId for edits and status changes.
					- Use DELETE /api/posts/:postId for deletion.
					- Refresh the posts query after each successful action.
				*/}
				<Table variant="secondary">
					<Table.ScrollContainer>
						<Table.Content aria-label="Example posts">
							<Table.Header>
								<Table.Column isRowHeader>Story</Table.Column>
								<Table.Column>Status</Table.Column>
								<Table.Column>Updated</Table.Column>
								<Table.Column>Published</Table.Column>
								<Table.Column>Actions</Table.Column>
							</Table.Header>
							<Table.Body>
								{examplePosts.map((post) => (
									<Table.Row id={post.id} key={post.id}>
										<Table.Cell className="min-w-60">
											<p className="font-semibold text-slate-900 dark:text-white">
												{post.title}
											</p>
											<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
												/{post.slug}
											</p>
										</Table.Cell>
										<Table.Cell>
											<Chip
												color={statusColor[post.status]}
												variant="soft"
												size="sm"
											>
												<Chip.Label className="capitalize">
													{post.status}
												</Chip.Label>
											</Chip>
										</Table.Cell>
										<Table.Cell className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
											{post.updated}
										</Table.Cell>
										<Table.Cell className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
											{post.published}
										</Table.Cell>
										<Table.Cell className="min-w-[30rem]">
											<div className="flex flex-wrap gap-2">
												<Button type="button" variant="secondary" size="sm">
													<FilePenLine size={15} aria-hidden="true" />
													Edit
												</Button>
												<Button type="button" variant="ghost" size="sm">
													<Send size={15} aria-hidden="true" />
													Publish
												</Button>
												<Button type="button" variant="ghost" size="sm">
													<Archive size={15} aria-hidden="true" />
													Archive
												</Button>
												<Button type="button" variant="danger-soft" size="sm">
													<Trash2 size={15} aria-hidden="true" />
													Delete
												</Button>
											</div>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Content>
					</Table.ScrollContainer>
				</Table>
			</Card.Content>
		</Card>
	);
}
