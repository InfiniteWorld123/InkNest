import { Card } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bookmark, Eye, Heart } from "lucide-react";
import {
	type PublicPost,
	postBySlugQueryOptions,
} from "#/frontend/api/queries/post.query";
import { userByUsernameQueryOptions } from "#/frontend/api/queries/users.query";

type PostCardProps = {
	post: PublicPost;
};

export function PostCard({ post }: PostCardProps) {
	const queryClient = useQueryClient();
	const prefetchPost = () => {
		void queryClient.prefetchQuery(postBySlugQueryOptions(post.slug));
	};
	const prefetchAuthor = () => {
		void queryClient.prefetchQuery(
			userByUsernameQueryOptions(post.authorUsername),
		);
	};

	return (
		<Card className="group relative h-full gap-0 overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
			{post.image && (
				<div className="overflow-hidden">
					<img
						src={post.image}
						alt=""
						loading="lazy"
						decoding="async"
						className="aspect-video w-full object-cover"
					/>
				</div>
			)}

			<Card.Content className="flex h-full flex-col p-6">
				{/*
				The current posts endpoint does not return categories or tags.
				If you add them to PublicPost, render those backend values here.
			*/}

				<Link
					to="/blog/$slug"
					params={{ slug: post.slug }}
					onMouseEnter={prefetchPost}
					onFocus={prefetchPost}
					className="focus:outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-accent-500"
				>
					<h3 className="text-xl font-semibold leading-7 text-slate-900 transition-colors group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
						{post.title}
					</h3>
				</Link>

				{/*
				BACKEND DATA: `content` is available, but decide how your frontend should
				create a safe plain-text excerpt before rendering it in this paragraph.
			*/}

				<div className="mt-auto flex items-end justify-between gap-4 pt-8">
					<Link
						to="/users/$username"
						params={{ username: post.authorUsername }}
						onMouseEnter={prefetchAuthor}
						onFocus={prefetchAuthor}
						className="relative z-10 min-w-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
					>
						<span className="block truncate text-sm font-medium text-slate-900 transition-colors hover:text-accent-700 dark:text-white dark:hover:text-accent-400">
							{post.authorName}
						</span>
						<span className="block truncate text-xs text-slate-500 dark:text-slate-400">
							@{post.authorUsername}
						</span>
						{/* BACKEND DATA: format and display `post.publishedAt` here. */}
					</Link>

					<div className="flex shrink-0 items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
						<span className="inline-flex items-center gap-1">
							<span className="sr-only">Views:</span>
							<Eye size={14} aria-hidden="true" />
							{post.viewsCount}
						</span>
						<span className="inline-flex items-center gap-1">
							<span className="sr-only">Likes:</span>
							<Heart size={14} aria-hidden="true" />
							{post.likesCount}
						</span>
						<span className="inline-flex items-center gap-1">
							<span className="sr-only">Bookmarks:</span>
							<Bookmark size={14} aria-hidden="true" />
							{post.bookmarksCount}
						</span>
					</div>
				</div>
			</Card.Content>
		</Card>
	);
}
