import {
	Alert,
	AlertDialog,
	Button,
	Card,
	Chip,
	Skeleton,
	Table,
} from "@heroui/react";
import {
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { CatchBoundary } from "@tanstack/react-router";
import { FilePenLine, FileText, Trash2 } from "lucide-react";
import { Suspense, useState } from "react";
import {
	currentUserPostsQueryOptions,
	deletePostMutation,
	type OwnPost,
} from "#/frontend/api/queries/post.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";

const dateFormatter = new Intl.DateTimeFormat("en", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

type PostManagementProps = {
	editingPostId: number | null;
	onEdit: (post: OwnPost) => void;
	onDeleted: (postId: number) => void;
};

export function PostManagementBoundary(props: PostManagementProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<CatchBoundary
					getResetKey={() => "studio-posts"}
					onCatch={reset}
					errorComponent={({ error, reset: resetBoundary }) => (
						<StudioPostsError
							error={error}
							onRetry={() => {
								reset();
								resetBoundary();
							}}
						/>
					)}
				>
					<Suspense fallback={<StudioPostsPending />}>
						<PostManagementSection {...props} />
					</Suspense>
				</CatchBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

function PostManagementSection({
	editingPostId,
	onEdit,
	onDeleted,
}: PostManagementProps) {
	const { data: posts } = useSuspenseQuery(currentUserPostsQueryOptions());
	const deletePost = deletePostMutation();
	const [deleteTarget, setDeleteTarget] = useState<OwnPost | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);
	const deletingPostId = deletePost.isPending
		? deletePost.variables?.postId
		: null;

	const confirmDelete = async () => {
		if (!deleteTarget) {
			return;
		}

		setActionError(null);

		try {
			await deletePost.mutateAsync({ postId: deleteTarget.id });
			onDeleted(deleteTarget.id);
			setDeleteTarget(null);
		} catch (error) {
			setActionError(
				getCaughtErrorMessage(error, "Unable to delete this post."),
			);
		}
	};

	return (
		<>
			<Card className="min-w-0 overflow-hidden">
				<Card.Header className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
					<div>
						<Card.Title>Your posts</Card.Title>
						<Card.Description className="mt-1">
							Edit or remove your published stories.
						</Card.Description>
					</div>
					<Chip color="accent" variant="soft" size="sm">
						<Chip.Label>
							{posts.length} {posts.length === 1 ? "story" : "stories"}
						</Chip.Label>
					</Chip>
				</Card.Header>

				{actionError && !deleteTarget ? (
					<div className="px-6 pt-5">
						<Alert status="danger">
							<Alert.Indicator />
							<Alert.Content>
								<Alert.Title>Action failed</Alert.Title>
								<Alert.Description>{actionError}</Alert.Description>
							</Alert.Content>
						</Alert>
					</div>
				) : null}

				<Card.Content className="p-0">
					{posts.length === 0 ? (
						<div className="px-6 py-16 text-center">
							<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
								<FileText size={23} aria-hidden="true" />
							</span>
							<h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
								Your first story starts here
							</h3>
							<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
								Use the editor to publish something for the InkNest community.
							</p>
						</div>
					) : (
						<Table variant="secondary">
							<Table.ScrollContainer>
								<Table.Content aria-label="Your posts">
									<Table.Header>
										<Table.Column isRowHeader>Story</Table.Column>
										<Table.Column>Updated</Table.Column>
										<Table.Column>Actions</Table.Column>
									</Table.Header>
									<Table.Body>
										{posts.map((post) => {
											const isDeleting = deletingPostId === post.id;
											const isBeingEdited = editingPostId === post.id;

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
													<Table.Cell className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
														{dateFormatter.format(new Date(post.updatedAt))}
													</Table.Cell>
													<Table.Cell className="min-w-52">
														<div className="flex flex-wrap gap-2">
															<Button
																type="button"
																variant={
																	isBeingEdited ? "primary" : "secondary"
																}
																size="sm"
																isDisabled={isDeleting}
																onPress={() => onEdit(post)}
															>
																<FilePenLine size={15} aria-hidden="true" />
																Edit
															</Button>
															<Button
																type="button"
																variant="danger-soft"
																size="sm"
																isDisabled={isDeleting || isBeingEdited}
																isPending={isDeleting}
																onPress={() => {
																	setActionError(null);
																	setDeleteTarget(post);
																}}
															>
																<Trash2 size={15} aria-hidden="true" />
																Delete
															</Button>
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

			<AlertDialog
				isOpen={deleteTarget !== null}
				onOpenChange={(isOpen) => {
					if (!isOpen && !deletePost.isPending) {
						setDeleteTarget(null);
					}
				}}
			>
				<AlertDialog.Backdrop>
					<AlertDialog.Container>
						<AlertDialog.Dialog>
							<AlertDialog.Header>
								<AlertDialog.Icon status="danger" />
								<AlertDialog.Heading>Delete this post?</AlertDialog.Heading>
							</AlertDialog.Header>
							<AlertDialog.Body>
								“{deleteTarget?.title}” will be permanently removed. This action
								cannot be undone.
								{actionError ? (
									<p className="mt-3 text-sm text-red-600 dark:text-red-400">
										{actionError}
									</p>
								) : null}
							</AlertDialog.Body>
							<AlertDialog.Footer>
								<Button
									type="button"
									variant="secondary"
									isDisabled={deletePost.isPending}
									onPress={() => setDeleteTarget(null)}
								>
									Cancel
								</Button>
								<Button
									type="button"
									variant="danger"
									isPending={deletePost.isPending}
									onPress={() => void confirmDelete()}
								>
									Delete post
								</Button>
							</AlertDialog.Footer>
						</AlertDialog.Dialog>
					</AlertDialog.Container>
				</AlertDialog.Backdrop>
			</AlertDialog>
		</>
	);
}

function StudioPostsPending() {
	return (
		<Card className="min-w-0 overflow-hidden" aria-busy="true">
			<Card.Header className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
				<div className="space-y-2">
					<Skeleton className="h-6 w-28 rounded" />
					<Skeleton className="h-4 w-64 max-w-full rounded" />
				</div>
				<Skeleton className="h-7 w-20 rounded-full" />
			</Card.Header>
			<Card.Content className="space-y-4 p-6">
				<span className="sr-only">Loading your posts…</span>
				{["first", "second", "third"].map((id) => (
					<div
						key={id}
						className="grid gap-3 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800 sm:grid-cols-[1fr_8rem_10rem]"
					>
						<div className="space-y-2">
							<Skeleton className="h-5 w-4/5 rounded" />
							<Skeleton className="h-3 w-2/5 rounded" />
						</div>
						<Skeleton className="h-5 w-24 rounded" />
						<Skeleton className="h-8 w-32 rounded" />
					</div>
				))}
			</Card.Content>
		</Card>
	);
}

function StudioPostsError({
	error,
	onRetry,
}: {
	error: Error;
	onRetry: () => void;
}) {
	return (
		<Card className="min-w-0 overflow-hidden">
			<Card.Content className="p-6">
				<Alert status="danger">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Could not load your posts</Alert.Title>
						<Alert.Description>{error.message}</Alert.Description>
						<Button
							type="button"
							variant="danger"
							size="sm"
							onPress={onRetry}
							className="mt-4"
						>
							Try again
						</Button>
					</Alert.Content>
				</Alert>
			</Card.Content>
		</Card>
	);
}
