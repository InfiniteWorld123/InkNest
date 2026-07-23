import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	currentUserPostsQueryOptions,
	type OwnPost,
} from "#/frontend/api/queries/post.query";
import { CreatePostSection } from "../sections/CreatePostSection";
import { PostManagementSection } from "../sections/PostManagementSection";

export function WriterStudioPage() {
	// GET /api/users/me/posts is loaded by this query and refreshed after mutations.
	const { data: posts } = useSuspenseQuery(currentUserPostsQueryOptions());
	const [editingPost, setEditingPost] = useState<OwnPost | null>(null);

	const startEditing = (post: OwnPost) => {
		setEditingPost(post);

		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<main className="mx-auto w-full max-w-[90rem] px-5 py-10 sm:py-14">
			<header className="max-w-3xl">
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
					Writer Studio
				</p>
				<h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
					Shape your next story.
				</h1>
				<p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
					Draft, publish, and organize your InkNest stories from one calm
					workspace.
				</p>
			</header>

			<div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(22rem,0.8fr)_minmax(0,1.6fr)]">
				<CreatePostSection
					key={editingPost?.id ?? "new"}
					post={editingPost}
					onCancelEdit={() => setEditingPost(null)}
					onSaved={() => setEditingPost(null)}
				/>
				<PostManagementSection
					posts={posts}
					onEdit={startEditing}
					onDeleted={(postId) => {
						if (editingPost?.id === postId) setEditingPost(null);
					}}
				/>
			</div>
		</main>
	);
}
