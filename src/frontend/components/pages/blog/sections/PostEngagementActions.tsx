import { Button, buttonVariants } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bookmark, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { sessionQueryOptions } from "#/frontend/api/queries/auth.query";
import {
	bookmarkPostMutation,
	likePostMutation,
	postViewerEngagementQueryOptions,
	removePostBookmarkMutation,
	unlikePostMutation,
} from "#/frontend/api/queries/engagement.query";
import type { PublicPost } from "#/frontend/api/queries/post.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";

export function PostEngagementActions({ post }: { post: PublicPost }) {
	const { data: session, isPending: isSessionPending } = useQuery(
		sessionQueryOptions(),
	);
	const { data: viewer, isPending: isViewerPending } = useQuery({
		...postViewerEngagementQueryOptions(post.id),
		enabled: Boolean(session),
	});
	const likePost = likePostMutation();
	const unlikePost = unlikePostMutation();
	const bookmarkPost = bookmarkPostMutation();
	const removeBookmark = removePostBookmarkMutation();
	const [actionError, setActionError] = useState<string | null>(null);
	const [hasMounted, setHasMounted] = useState(false);
	const isLikePending = likePost.isPending || unlikePost.isPending;
	const isBookmarkPending = bookmarkPost.isPending || removeBookmark.isPending;
	const activeSession = hasMounted ? session : null;
	const isSessionLoading = !hasMounted || isSessionPending;

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const toggleLike = async () => {
		setActionError(null);

		try {
			if (viewer?.liked) {
				await unlikePost.mutateAsync({ postId: post.id });
			} else {
				await likePost.mutateAsync({ postId: post.id });
			}
		} catch (error) {
			setActionError(
				getCaughtErrorMessage(error, "Unable to update your like."),
			);
		}
	};

	const toggleBookmark = async () => {
		setActionError(null);

		try {
			if (viewer?.bookmarked) {
				await removeBookmark.mutateAsync({ postId: post.id });
			} else {
				await bookmarkPost.mutateAsync({ postId: post.id });
			}
		} catch (error) {
			setActionError(
				getCaughtErrorMessage(error, "Unable to update your bookmark."),
			);
		}
	};

	return (
		<section aria-label="Post actions" className="px-5 pt-8">
			<div className="mx-auto flex max-w-2xl flex-wrap items-center gap-3 border-b border-slate-200 pb-8 dark:border-slate-800">
				{activeSession ? (
					<>
						<Button
							type="button"
							variant={viewer?.liked ? "primary" : "outline"}
							aria-pressed={viewer?.liked ?? false}
							onPress={toggleLike}
							isDisabled={isViewerPending || isLikePending}
							isPending={isLikePending}
						>
							<Heart
								size={17}
								fill={viewer?.liked ? "currentColor" : "none"}
								aria-hidden="true"
							/>
							{viewer?.liked ? "Liked" : "Like"} · {post.likesCount}
						</Button>
						<Button
							type="button"
							variant={viewer?.bookmarked ? "primary" : "outline"}
							aria-pressed={viewer?.bookmarked ?? false}
							onPress={toggleBookmark}
							isDisabled={isViewerPending || isBookmarkPending}
							isPending={isBookmarkPending}
						>
							<Bookmark
								size={17}
								fill={viewer?.bookmarked ? "currentColor" : "none"}
								aria-hidden="true"
							/>
							{viewer?.bookmarked ? "Saved" : "Save"} · {post.bookmarksCount}
						</Button>
					</>
				) : isSessionLoading ? (
					<>
						<Button variant="outline" isDisabled>
							<Heart size={17} aria-hidden="true" /> Like · {post.likesCount}
						</Button>
						<Button variant="outline" isDisabled>
							<Bookmark size={17} aria-hidden="true" /> Save ·{" "}
							{post.bookmarksCount}
						</Button>
					</>
				) : (
					<>
						<Link
							to="/sign-in"
							className={buttonVariants({ variant: "outline" })}
						>
							<Heart size={17} aria-hidden="true" /> Like · {post.likesCount}
						</Link>
						<Link
							to="/sign-in"
							className={buttonVariants({ variant: "outline" })}
						>
							<Bookmark size={17} aria-hidden="true" /> Save ·{" "}
							{post.bookmarksCount}
						</Link>
						<span className="text-xs text-slate-500 dark:text-slate-400">
							Sign in to react to this story.
						</span>
					</>
				)}

				{actionError ? (
					<p
						className="w-full text-sm text-red-600 dark:text-red-400"
						role="alert"
					>
						{actionError}
					</p>
				) : null}
			</div>
		</section>
	);
}
