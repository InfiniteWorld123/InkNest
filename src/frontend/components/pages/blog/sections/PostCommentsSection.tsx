import { Button, buttonVariants } from "@heroui/react";
import { useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Pencil, Reply, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { sessionQueryOptions } from "#/frontend/api/queries/auth.query";
import {
	type CommentItem,
	createCommentMutation,
	deleteCommentMutation,
	postCommentsQueryOptions,
	updateCommentMutation,
} from "#/frontend/api/queries/comments.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { Avatar } from "#/frontend/components/shared/ui/Avatar";
import { LoadMoreButton } from "#/frontend/components/shared/ui/LoadMoreButton";

const commentDateFormatter = new Intl.DateTimeFormat("en", {
	dateStyle: "medium",
	timeStyle: "short",
});

type CommentAuthor = {
	userId: string;
	name: string;
	username: string | null;
	image: string | null;
};

type CommentThread = {
	key: string;
	root: CommentItem | null;
	replies: CommentItem[];
	latestActivity: number;
	missingParentName: string | null;
	missingParentUsername: string | null;
};

type CommentManagement = {
	currentUserId: string | null;
	editingId: number | null;
	editContent: string;
	deletingId: number | null;
	isEditPending: boolean;
	isDeletePending: boolean;
	onStartEdit: (comment: CommentItem) => void;
	onEditChange: (value: string) => void;
	onSaveEdit: (event: FormEvent<HTMLFormElement>, commentId: number) => void;
	onCancelEdit: () => void;
	onRequestDelete: (commentId: number) => void;
	onConfirmDelete: (commentId: number) => void;
	onCancelDelete: () => void;
};

const getCommentTimestamp = (comment: CommentItem) =>
	new Date(comment.createdAt).getTime();

function buildCommentThreads(comments: CommentItem[]) {
	const commentsById = new Map(
		comments.map((comment) => [comment.id, comment]),
	);
	const threads = new Map<string, CommentThread>();

	const findLoadedRoot = (comment: CommentItem) => {
		let current = comment;
		const visited = new Set<number>();

		while (current.parentId) {
			if (visited.has(current.id)) return null;
			visited.add(current.id);

			const parent = commentsById.get(current.parentId);
			if (!parent) return null;
			current = parent;
		}

		return current;
	};

	for (const comment of comments) {
		if (comment.parentId) continue;

		threads.set(`root-${comment.id}`, {
			key: `root-${comment.id}`,
			root: comment,
			replies: [],
			latestActivity: getCommentTimestamp(comment),
			missingParentName: null,
			missingParentUsername: null,
		});
	}

	for (const comment of comments) {
		if (!comment.parentId) continue;

		const root = findLoadedRoot(comment);
		const key = root ? `root-${root.id}` : `missing-${comment.parentId}`;
		const thread = threads.get(key) ?? {
			key,
			root,
			replies: [],
			latestActivity: 0,
			missingParentName: comment.parentAuthorName,
			missingParentUsername: comment.parentAuthorUsername,
		};

		thread.replies.push(comment);
		thread.latestActivity = Math.max(
			thread.latestActivity,
			getCommentTimestamp(comment),
		);
		threads.set(key, thread);
	}

	return [...threads.values()]
		.map((thread) => ({
			...thread,
			replies: thread.replies.sort(
				(left, right) => getCommentTimestamp(right) - getCommentTimestamp(left),
			),
		}))
		.sort((left, right) => right.latestActivity - left.latestActivity);
}

export function PostCommentsSection({ postId }: { postId: number }) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery(postCommentsQueryOptions(postId));
	const { data: session, isPending: isSessionPending } = useQuery(
		sessionQueryOptions(),
	);
	const createComment = createCommentMutation();
	const updateComment = updateCommentMutation();
	const deleteComment = deleteCommentMutation();
	const [content, setContent] = useState("");
	const [replyContent, setReplyContent] = useState("");
	const [replyingTo, setReplyingTo] = useState<CommentItem | null>(null);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editContent, setEditContent] = useState("");
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [formError, setFormError] = useState<string | null>(null);
	const [hasMounted, setHasMounted] = useState(false);
	const comments = data.pages.flatMap((page) => page.items);
	const activeSession = hasMounted ? session : null;
	const isSessionLoading = !hasMounted || isSessionPending;
	const commentThreads = buildCommentThreads(comments);
	const author: CommentAuthor | null = activeSession
		? {
				userId: activeSession.user.id,
				name: activeSession.user.name,
				username: null,
				image: activeSession.user.image ?? null,
			}
		: null;

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const publishComment = async ({
		nextContent,
		parent,
	}: {
		nextContent: string;
		parent?: CommentItem;
	}) => {
		if (!author) return;

		await createComment.mutateAsync({
			postId,
			body: {
				content: nextContent,
				parentId: parent?.id,
			},
			author,
			parent: parent
				? {
						name: parent.authorName,
						username: parent.authorUsername,
					}
				: undefined,
		});
	};

	const submitComment = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const nextContent = content.trim();

		if (!nextContent) {
			setFormError("Please write a comment first.");
			return;
		}

		setFormError(null);
		setContent("");

		try {
			await publishComment({ nextContent });
		} catch (error) {
			setContent((current) => current || nextContent);
			setFormError(
				getCaughtErrorMessage(error, "Unable to publish your comment."),
			);
		}
	};

	const submitReply = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const parent = replyingTo;
		const nextContent = replyContent.trim();

		if (!parent || !nextContent) {
			setFormError("Please write a reply first.");
			return;
		}

		setFormError(null);
		setReplyContent("");
		setReplyingTo(null);

		try {
			await publishComment({ nextContent, parent });
		} catch (error) {
			setReplyingTo(parent);
			setReplyContent((current) => current || nextContent);
			setFormError(
				getCaughtErrorMessage(error, "Unable to publish your reply."),
			);
		}
	};

	const saveEdit = async (
		event: FormEvent<HTMLFormElement>,
		commentId: number,
	) => {
		event.preventDefault();
		const nextContent = editContent.trim();

		if (!nextContent) {
			setFormError("A comment cannot be empty.");
			return;
		}

		setFormError(null);

		try {
			await updateComment.mutateAsync({
				id: commentId,
				body: { content: nextContent },
			});
			setEditingId(null);
			setEditContent("");
		} catch (error) {
			setFormError(
				getCaughtErrorMessage(error, "Unable to update your comment."),
			);
		}
	};

	const confirmDelete = async (commentId: number) => {
		setFormError(null);

		try {
			await deleteComment.mutateAsync({ id: commentId });
			setDeletingId(null);
		} catch (error) {
			setFormError(
				getCaughtErrorMessage(error, "Unable to delete your comment."),
			);
		}
	};

	const management: CommentManagement = {
		currentUserId: activeSession?.user.id ?? null,
		editingId,
		editContent,
		deletingId,
		isEditPending: updateComment.isPending,
		isDeletePending: deleteComment.isPending,
		onStartEdit: (comment) => {
			setFormError(null);
			setReplyingTo(null);
			setReplyContent("");
			setDeletingId(null);
			setEditingId(comment.id);
			setEditContent(comment.content);
		},
		onEditChange: setEditContent,
		onSaveEdit: saveEdit,
		onCancelEdit: () => {
			setEditingId(null);
			setEditContent("");
		},
		onRequestDelete: (commentId) => {
			setFormError(null);
			setReplyingTo(null);
			setReplyContent("");
			setEditingId(null);
			setDeletingId(commentId);
		},
		onConfirmDelete: (commentId) => void confirmDelete(commentId),
		onCancelDelete: () => setDeletingId(null),
	};

	return (
		<section aria-labelledby="comments-heading" className="px-5 pb-24 pt-4">
			<div className="mx-auto max-w-2xl">
				<div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400">
						<MessageCircle size={19} aria-hidden="true" />
					</span>
					<div>
						<h2
							id="comments-heading"
							className="text-xl font-bold text-slate-900 dark:text-white"
						>
							Conversation
						</h2>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							{comments.length} loaded{" "}
							{comments.length === 1 ? "comment" : "comments"}
						</p>
					</div>
				</div>

				<div className="py-7">
					{activeSession ? (
						<CommentComposer
							id="new-comment"
							label="Join the conversation"
							value={content}
							onChange={setContent}
							onSubmit={submitComment}
							buttonLabel="Publish comment"
							pendingLabel="Publishing…"
							isPending={createComment.isPending}
							helper={`Commenting as ${activeSession.user.name}`}
						/>
					) : isSessionLoading ? (
						<div className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
					) : (
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
							<p className="text-sm text-slate-600 dark:text-slate-300">
								Every InkNest member can join this conversation.
							</p>
							<Link
								to="/sign-in"
								className={`${buttonVariants({ variant: "primary", size: "sm" })} mt-4`}
							>
								Sign in to comment
							</Link>
						</div>
					)}
					{formError ? (
						<p
							className="mt-3 text-sm text-red-600 dark:text-red-400"
							role="alert"
						>
							{formError}
						</p>
					) : null}
				</div>

				{comments.length === 0 ? (
					<p className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
						No comments yet. Start the conversation.
					</p>
				) : (
					<ol className="space-y-6">
						{commentThreads.map((thread) => (
							<CommentThreadCard
								key={thread.key}
								thread={thread}
								canReply={Boolean(activeSession)}
								replyingToId={replyingTo?.id ?? null}
								replyContent={replyContent}
								isReplyPending={createComment.isPending}
								management={management}
								onReply={(comment) => {
									setFormError(null);
									setReplyingTo(comment);
								}}
								onReplyChange={setReplyContent}
								onReplySubmit={submitReply}
								onCancelReply={() => {
									setReplyingTo(null);
									setReplyContent("");
								}}
							/>
						))}
					</ol>
				)}

				<div className="mt-8">
					<LoadMoreButton
						onClick={() => void fetchNextPage()}
						isLoading={isFetchingNextPage}
						hasMore={Boolean(hasNextPage)}
					/>
				</div>
			</div>
		</section>
	);
}

function CommentThreadCard({
	thread,
	canReply,
	replyingToId,
	replyContent,
	isReplyPending,
	management,
	onReply,
	onReplyChange,
	onReplySubmit,
	onCancelReply,
}: {
	thread: CommentThread;
	canReply: boolean;
	replyingToId: number | null;
	replyContent: string;
	isReplyPending: boolean;
	management: CommentManagement;
	onReply: (comment: CommentItem) => void;
	onReplyChange: (value: string) => void;
	onReplySubmit: (event: FormEvent<HTMLFormElement>) => void;
	onCancelReply: () => void;
}) {
	return (
		<li className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
			{thread.root ? (
				<div className="p-5">
					<CommentCard
						comment={thread.root}
						canReply={canReply}
						isReplying={replyingToId === thread.root.id}
						replyContent={replyContent}
						isReplyPending={isReplyPending}
						management={management}
						onReply={() => onReply(thread.root as CommentItem)}
						onReplyChange={onReplyChange}
						onReplySubmit={onReplySubmit}
						onCancelReply={onCancelReply}
					/>
				</div>
			) : (
				<div className="flex items-center gap-2 border-b border-accent-100 bg-accent-50/70 px-5 py-3 text-xs font-medium text-accent-700 dark:border-accent-500/20 dark:bg-accent-500/10 dark:text-accent-300">
					<Reply size={14} aria-hidden="true" />
					Replies to {thread.missingParentUsername ? "@" : ""}
					{thread.missingParentUsername ??
						thread.missingParentName ??
						"an earlier comment"}
				</div>
			)}

			{thread.replies.length > 0 ? (
				<ol
					aria-label={
						thread.root ? `Replies to ${thread.root.authorName}` : "Replies"
					}
					className={`${thread.root ? "border-t border-slate-200/80" : ""} bg-slate-50/80 px-5 dark:bg-slate-950/30`}
				>
					{thread.replies.map((reply) => (
						<li
							key={reply.id}
							className="relative border-b border-slate-200/80 py-5 pl-9 last:border-b-0"
						>
							<span
								className="absolute bottom-0 left-3 top-0 w-px bg-accent-200 dark:bg-accent-500/30"
								aria-hidden="true"
							/>
							<span
								className="absolute left-[9px] top-8 h-2 w-2 rounded-full bg-accent-500 ring-4 ring-slate-50 dark:ring-slate-950"
								aria-hidden="true"
							/>
							<CommentCard
								comment={reply}
								canReply={canReply}
								isReplying={replyingToId === reply.id}
								replyContent={replyContent}
								isReplyPending={isReplyPending}
								management={management}
								onReply={() => onReply(reply)}
								onReplyChange={onReplyChange}
								onReplySubmit={onReplySubmit}
								onCancelReply={onCancelReply}
							/>
						</li>
					))}
				</ol>
			) : null}
		</li>
	);
}

function CommentComposer({
	id,
	label,
	value,
	onChange,
	onSubmit,
	buttonLabel,
	pendingLabel,
	isPending,
	helper,
	onCancel,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	buttonLabel: string;
	pendingLabel: string;
	isPending: boolean;
	helper: string;
	onCancel?: () => void;
}) {
	return (
		<form onSubmit={onSubmit} className="space-y-3">
			<label
				htmlFor={id}
				className="text-sm font-semibold text-slate-900 dark:text-white"
			>
				{label}
			</label>
			<textarea
				id={id}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				maxLength={5000}
				rows={onCancel ? 3 : 4}
				placeholder={
					onCancel ? "Write your reply…" : "Share a thoughtful response…"
				}
				className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
			/>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="text-xs text-slate-500 dark:text-slate-400">
					{helper} · {value.length}/5000
				</p>
				<div className="flex items-center gap-2">
					{onCancel ? (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onPress={onCancel}
							isDisabled={isPending}
						>
							Cancel
						</Button>
					) : null}
					<Button
						type="submit"
						variant="primary"
						size={onCancel ? "sm" : "md"}
						isDisabled={isPending || !value.trim()}
						isPending={isPending}
					>
						{isPending ? pendingLabel : buttonLabel}
					</Button>
				</div>
			</div>
		</form>
	);
}

function CommentCard({
	comment,
	canReply,
	isReplying,
	replyContent,
	isReplyPending,
	management,
	onReply,
	onReplyChange,
	onReplySubmit,
	onCancelReply,
}: {
	comment: CommentItem;
	canReply: boolean;
	isReplying: boolean;
	replyContent: string;
	isReplyPending: boolean;
	management: CommentManagement;
	onReply: () => void;
	onReplyChange: (value: string) => void;
	onReplySubmit: (event: FormEvent<HTMLFormElement>) => void;
	onCancelReply: () => void;
}) {
	const isOwner =
		management.currentUserId === comment.userId && !comment.isOptimistic;
	const isEditing = management.editingId === comment.id;
	const isConfirmingDelete = management.deletingId === comment.id;
	const identity = (
		<>
			<Avatar src={comment.authorImage} name={comment.authorName} size="sm" />
			<span className="min-w-0">
				<span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
					{comment.authorName}
				</span>
				{comment.authorUsername ? (
					<span className="block truncate text-xs text-slate-500 dark:text-slate-400">
						@{comment.authorUsername}
					</span>
				) : null}
			</span>
		</>
	);

	return (
		<article>
			{comment.parentId && comment.parentAuthorName ? (
				<p className="mb-3 text-xs font-medium text-accent-700 dark:text-accent-400">
					Replying to {comment.parentAuthorUsername ? "@" : ""}
					{comment.parentAuthorUsername ?? comment.parentAuthorName}
				</p>
			) : null}
			<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
				{comment.authorUsername ? (
					<Link
						to="/users/$username"
						params={{ username: comment.authorUsername }}
						className="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
					>
						{identity}
					</Link>
				) : (
					<div className="flex min-w-0 items-center gap-3">{identity}</div>
				)}
				{comment.isOptimistic ? (
					<span className="shrink-0 text-xs font-medium text-accent-600 dark:text-accent-400">
						Publishing…
					</span>
				) : (
					<time
						dateTime={new Date(comment.createdAt).toISOString()}
						className="shrink-0 text-xs text-slate-500 dark:text-slate-400"
					>
						{commentDateFormatter.format(new Date(comment.createdAt))}
					</time>
				)}
			</div>
			{isEditing ? (
				<form
					onSubmit={(event) => management.onSaveEdit(event, comment.id)}
					className="mt-4 space-y-3"
				>
					<label htmlFor={`edit-comment-${comment.id}`} className="sr-only">
						Edit comment
					</label>
					<textarea
						id={`edit-comment-${comment.id}`}
						value={management.editContent}
						onChange={(event) => management.onEditChange(event.target.value)}
						maxLength={5000}
						rows={3}
						className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					/>
					<div className="flex items-center justify-end gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onPress={management.onCancelEdit}
							isDisabled={management.isEditPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="primary"
							size="sm"
							isDisabled={
								management.isEditPending || !management.editContent.trim()
							}
							isPending={management.isEditPending}
						>
							{management.isEditPending ? "Saving…" : "Save changes"}
						</Button>
					</div>
				</form>
			) : (
				<p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
					{comment.content}
				</p>
			)}

			{!isEditing && (canReply || isOwner) ? (
				<div className="mt-3 flex flex-wrap items-center gap-1">
					{canReply && !comment.isOptimistic ? (
						<Button
							variant="ghost"
							size="sm"
							onPress={onReply}
							isDisabled={isReplyPending || management.isDeletePending}
						>
							<Reply size={15} aria-hidden="true" />
							Reply
						</Button>
					) : null}
					{isOwner ? (
						<>
							<Button
								variant="ghost"
								size="sm"
								onPress={() => management.onStartEdit(comment)}
								isDisabled={management.isDeletePending}
							>
								<Pencil size={14} aria-hidden="true" />
								Edit
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-red-600 dark:text-red-400"
								onPress={() => management.onRequestDelete(comment.id)}
								isDisabled={management.isDeletePending}
							>
								<Trash2 size={14} aria-hidden="true" />
								Delete
							</Button>
						</>
					) : null}
				</div>
			) : null}

			{isConfirmingDelete ? (
				<div
					className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-500/30 dark:bg-red-500/10"
					role="alert"
				>
					<p className="text-xs font-medium text-red-700 dark:text-red-300">
						Delete this comment
						{comment.parentId ? "?" : " and all of its replies?"}
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onPress={management.onCancelDelete}
							isDisabled={management.isDeletePending}
						>
							Cancel
						</Button>
						<Button
							variant="danger"
							size="sm"
							onPress={() => management.onConfirmDelete(comment.id)}
							isDisabled={management.isDeletePending}
							isPending={management.isDeletePending}
						>
							{management.isDeletePending ? "Deleting…" : "Delete comment"}
						</Button>
					</div>
				</div>
			) : null}
			{isReplying && !isEditing && !isConfirmingDelete ? (
				<div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
					<CommentComposer
						id={`reply-${comment.id}`}
						label={`Reply to ${comment.authorName}`}
						value={replyContent}
						onChange={onReplyChange}
						onSubmit={onReplySubmit}
						buttonLabel="Publish reply"
						pendingLabel="Replying…"
						isPending={isReplyPending}
						helper="Your reply will appear at the top"
						onCancel={onCancelReply}
					/>
				</div>
			) : null}
		</article>
	);
}
