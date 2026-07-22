import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Feather } from "lucide-react";
import type { PublicPost } from "#/frontend/api/queries/post.query";
import { Avatar } from "#/frontend/components/shared/ui/Avatar";

export function PostDetailAuthor({ post }: { post: PublicPost }) {
	return (
		<section aria-labelledby="post-author-heading" className="px-5 pb-20">
			<div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9 dark:border-slate-800 dark:bg-slate-900/60">
				<div className="flex items-start gap-4">
					<Avatar src={post.authorImage} name={post.authorName} size="lg" />
					<div className="min-w-0 flex-1">
						<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-700 dark:text-accent-400">
							<Feather size={14} aria-hidden="true" /> About the writer
						</p>
						<h2
							id="post-author-heading"
							className="mt-2 text-xl font-bold text-slate-900 dark:text-white"
						>
							{post.authorName}
						</h2>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
							@{post.authorUsername}
						</p>
					</div>
				</div>

				<Link
					to="/users/$username"
					params={{ username: post.authorUsername }}
					className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:bg-accent-500 dark:text-slate-950"
				>
					View profile <ArrowUpRight size={16} aria-hidden="true" />
				</Link>
			</div>
		</section>
	);
}
