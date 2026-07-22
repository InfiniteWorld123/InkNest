import type {
	PostsPagination,
	PublicPost,
} from "#/frontend/api/queries/post.query";
import { BlogPagination } from "./BlogPagination";
import { PostCard } from "./PostCard";

type BlogPostsSectionProps = {
	data: PublicPost[];
	pagination: PostsPagination;
};

export function BlogPostsSection({ data, pagination }: BlogPostsSectionProps) {
	return (
		<section aria-labelledby="posts-heading" className="mt-12">
			<div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
				<div>
					<p className="text-sm font-medium text-accent-600 dark:text-accent-400">
						Latest from the community
					</p>
					<h2
						id="posts-heading"
						className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
					>
						All stories
					</h2>
				</div>

				<p className="text-sm text-slate-500 dark:text-slate-400">
					{pagination.total} {pagination.total === 1 ? "story" : "stories"}
				</p>
			</div>

			<div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{data.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>

			<BlogPagination pagination={pagination} />
		</section>
	);
}
