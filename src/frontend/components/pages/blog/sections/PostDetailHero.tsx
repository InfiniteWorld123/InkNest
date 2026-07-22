import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock3, Eye } from "lucide-react";
import type { PublicPost } from "#/frontend/api/queries/post.query";
import { Avatar } from "#/frontend/components/shared/ui/Avatar";

const publishedDateFormatter = new Intl.DateTimeFormat("en", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

export function PostDetailHero({ post }: { post: PublicPost }) {
	const publishedDate = post.publishedAt ?? post.createdAt;
	const readingMinutes = Math.max(
		1,
		Math.ceil(post.content.trim().split(/\s+/).length / 220),
	);

	return (
		<header className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
			<div className="absolute -right-24 -top-36 h-80 w-80 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-800/10" />
			<div className="relative mx-auto max-w-5xl px-5 pb-12 pt-8 sm:pb-16 sm:pt-10">
				<Link
					to="/blog"
					className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-slate-300 dark:hover:text-accent-400"
				>
					<ArrowLeft size={16} aria-hidden="true" /> Back to all stories
				</Link>

				<div className="mt-12 max-w-4xl">
					<p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-700 dark:text-accent-400">
						Community story
					</p>
					<h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl dark:text-white">
						{post.title}
					</h1>

					<div className="mt-8 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
						<Link
							to="/users/$username"
							params={{ username: post.authorUsername }}
							className="flex w-fit items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
						>
							<Avatar src={post.authorImage} name={post.authorName} size="md" />
							<span>
								<span className="block text-sm font-semibold text-slate-900 dark:text-white">
									{post.authorName}
								</span>
								<span className="block text-xs text-slate-500 dark:text-slate-400">
									@{post.authorUsername}
								</span>
							</span>
						</Link>

						<div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
							<span className="inline-flex items-center gap-1.5">
								<CalendarDays size={14} aria-hidden="true" />
								{publishedDateFormatter.format(new Date(publishedDate))}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Clock3 size={14} aria-hidden="true" /> {readingMinutes} min
								read
							</span>
						</div>
					</div>
				</div>

				{post.image && (
					<div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800">
						<img
							src={post.image}
							alt=""
							className="aspect-[16/8] w-full object-cover"
						/>
					</div>
				)}

				<div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
					<Metric icon={Eye} label="views" value={post.viewsCount} />
				</div>
			</div>
		</header>
	);
}

function Metric({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof Eye;
	label: string;
	value: number;
}) {
	return (
		<span className="inline-flex items-center gap-1.5">
			<Icon size={16} aria-hidden="true" /> {value.toLocaleString()} {label}
		</span>
	);
}
