import { useState } from "react";
import type { OwnPost } from "#/frontend/api/queries/post.query";
import { CreatePostSection } from "../sections/CreatePostSection";
import { PostManagementBoundary } from "../sections/PostManagementSection";
import { StudioHeader } from "../sections/StudioHeader";

export function WriterStudioPage() {
	const [editingPost, setEditingPost] = useState<OwnPost | null>(null);

	const editPost = (post: OwnPost) => {
		setEditingPost(post);
		requestAnimationFrame(() => {
			document
				.getElementById("studio-editor")
				?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<StudioHeader />
			<main className="mx-auto w-full max-w-[90rem] px-5 py-10 sm:py-14">
				<header className="max-w-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
						Writer Studio
					</p>
					<h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
						Shape your next story.
					</h1>
					<p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
						Draft, publish, and manage your stories from one focused workspace.
					</p>
				</header>

				<div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(22rem,0.8fr)_minmax(0,1.6fr)]">
					<CreatePostSection
						editingPost={editingPost}
						onCancelEdit={() => setEditingPost(null)}
					/>
					<PostManagementBoundary
						editingPostId={editingPost?.id ?? null}
						onEdit={editPost}
						onPostUpdated={(postId, changes) => {
							setEditingPost((current) =>
								current?.id === postId ? { ...current, ...changes } : current,
							);
						}}
						onDeleted={(postId) => {
							if (editingPost?.id === postId) {
								setEditingPost(null);
							}
						}}
					/>
				</div>
			</main>
		</div>
	);
}
