import { Alert, AlertDialog, Button, Card, Chip, Table } from "@heroui/react";
import { Archive, FilePenLine, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	deletePostMutation,
	type OwnPost,
	updatePostMutation,
} from "#/frontend/api/queries/post.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";

type PostStatus = OwnPost["status"];

type PostManagementSectionProps = {
	posts: OwnPost[];
	onEdit: (post: OwnPost) => void;
	onDeleted: (postId: number) => void;
};

const statusOptions: Array<{
	status: PostStatus;
	label: string;
	icon: typeof Send;
}> = [
	{ status: "draft", label: "Draft", icon: FilePenLine },
	{ status: "published", label: "Publish", icon: Send },
	{ status: "archived", label: "Archive", icon: Archive },
];

const statusColor: Record<PostStatus, "default" | "success" | "warning"> = {
	draft: "warning",
	published: "success",
	archived: "default",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
	year: "numeric",
	month: "short",
	day: "numeric",
	timeZone: "UTC",
});

const formatDate = (value: string | Date | null): string => {
	if (!value) return "Not published";

	const date = new Date(value);

	return Number.isNaN(date.getTime()) ? "Unknown" : dateFormatter.format(date);
};

export function PostManagementSection({
	posts,
	onEdit,
	onDeleted,
}: PostManagementSectionProps) {
	const updatePost = updatePostMutation();
	const deletePost = deletePostMutation();
	const [actionError, setActionError] = useState<string | null>(null);

	const changeStatus = async (post: OwnPost, status: PostStatus) => {
		setActionError(null);

		try {
			// This sends only the changed status to PATCH /api/posts/:postId.
			await updatePost.mutateAsync({
				postId: post.id,
				body: { status },
			});
		} catch (error) {
			setActionError(
				getCaughtErrorMessage(error, "Unable to change the post status."),
			);
		}
	};

	return (
		<Card className="min-w-0 overflow-hidden">
			<Card.Header className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
				<div>
					<Card.Title>Your posts</Card.Title>
					<Card.Description className="mt-1">
						Review every draft, published story, and archived idea.
					</Card.Description>
				</div>
				<Chip color="accent" variant="soft" size="sm">
					<Chip.Label>
						{posts.length} {posts.length === 1 ? "story" : "stories"}
					</Chip.Label>
				</Chip>
			</Card.Header>

			<Card.Content className="p-0">
				{actionError ? (
					<div className="p-5 pb-0">
						<Alert status="danger">
							<Alert.Indicator />
							<Alert.Content>
								<Alert.Title>Action failed</Alert.Title>
								<Alert.Description>{actionError}</Alert.Description>
							</Alert.Content>
						</Alert>
					</div>
				) : null}

				{posts.length === 0 ? (
					<div className="px-6 py-16 text-center">
						<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
							<FilePenLine size={21} aria-hidden="true" />
						</span>
						<p className="mt-4 font-semibold text-slate-900 dark:text-white">
							No posts yet
						</p>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
							Write your first story with the form beside this table.
						</p>
					</div>
				) : (
					<Table variant="secondary">
						<Table.ScrollContainer>
							<Table.Content aria-label="Your posts">
								<Table.Header>
									<Table.Column isRowHeader>Story</Table.Column>
									<Table.Column>Status</Table.Column>
									<Table.Column>Updated</Table.Column>
									<Table.Column>Published</Table.Column>
									<Table.Column>Actions</Table.Column>
								</Table.Header>
								<Table.Body>
									{posts.map((post) => {
										const isUpdatingThisPost =
											updatePost.isPending &&
											updatePost.variables?.postId === post.id;
										const isDeletingThisPost =
											deletePost.isPending &&
											deletePost.variables?.postId === post.id;

										return (
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
													{formatDate(post.updatedAt)}
												</Table.Cell>
												<Table.Cell className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
													{formatDate(post.publishedAt)}
												</Table.Cell>
												<Table.Cell className="min-w-[34rem]">
													<div className="flex flex-wrap gap-2">
														<Button
															type="button"
															variant="secondary"
															size="sm"
															isDisabled={
																isUpdatingThisPost || isDeletingThisPost
															}
															onPress={() => onEdit(post)}
														>
															<FilePenLine size={15} aria-hidden="true" />
															Edit
														</Button>
														{statusOptions.map((option) => {
															const StatusIcon = option.icon;

															return (
																<Button
																	key={option.status}
																	type="button"
																	variant="ghost"
																	size="sm"
																	isDisabled={
																		post.status === option.status ||
																		isUpdatingThisPost ||
																		isDeletingThisPost
																	}
																	isPending={
																		isUpdatingThisPost &&
																		updatePost.variables?.body.status ===
																			option.status
																	}
																	onPress={() =>
																		changeStatus(post, option.status)
																	}
																	aria-label={`Set ${post.title} to ${option.status}`}
																>
																	<StatusIcon size={15} aria-hidden="true" />
																	{option.label}
																</Button>
															);
														})}

														<AlertDialog>
															<AlertDialog.Trigger>
																<Button
																	type="button"
																	variant="danger-soft"
																	size="sm"
																	isDisabled={
																		isUpdatingThisPost || isDeletingThisPost
																	}
																>
																	<Trash2 size={15} aria-hidden="true" />
																	Delete
																</Button>
															</AlertDialog.Trigger>
															<AlertDialog.Backdrop>
																<AlertDialog.Container size="md">
																	<AlertDialog.Dialog>
																		{({ close }) => (
																			<>
																				<AlertDialog.CloseTrigger />
																				<AlertDialog.Header>
																					<AlertDialog.Icon status="danger" />
																					<AlertDialog.Heading>
																						Delete this post?
																					</AlertDialog.Heading>
																				</AlertDialog.Header>
																				<AlertDialog.Body>
																					“{post.title}” will be deleted
																					permanently. This cannot be undone.
																				</AlertDialog.Body>
																				<AlertDialog.Footer>
																					<Button
																						type="button"
																						variant="ghost"
																						isDisabled={isDeletingThisPost}
																						onPress={close}
																					>
																						Cancel
																					</Button>
																					<Button
																						type="button"
																						variant="danger"
																						isDisabled={isDeletingThisPost}
																						isPending={isDeletingThisPost}
																						onPress={async () => {
																							setActionError(null);

																							try {
																								// DELETE /api/posts/:postId is author-only.
																								await deletePost.mutateAsync({
																									postId: post.id,
																								});
																								onDeleted(post.id);
																								close();
																							} catch (error) {
																								setActionError(
																									getCaughtErrorMessage(
																										error,
																										"Unable to delete the post.",
																									),
																								);
																							}
																						}}
																					>
																						{isDeletingThisPost
																							? "Deleting…"
																							: "Delete post"}
																					</Button>
																				</AlertDialog.Footer>
																			</>
																		)}
																	</AlertDialog.Dialog>
																</AlertDialog.Container>
															</AlertDialog.Backdrop>
														</AlertDialog>
													</div>
												</Table.Cell>
											</Table.Row>
										);
									})}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>
				)}
			</Card.Content>
		</Card>
	);
}
