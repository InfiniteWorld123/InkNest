import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import type { PublicUser } from "#/frontend/api/queries/users.query";
import { Avatar } from "#/frontend/components/shared/ui/Avatar";

const joinedDateFormatter = new Intl.DateTimeFormat("en", {
	month: "long",
	year: "numeric",
});

export function UserProfileHero({ user }: { user: PublicUser }) {
	return (
		<header className="relative border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
			<div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-800/10" />
			<div className="relative mx-auto max-w-5xl px-5 pb-12 pt-8 sm:pb-16 sm:pt-10">
				<Link
					to="/users"
					className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-slate-300 dark:hover:text-accent-400"
				>
					<ArrowLeft size={16} aria-hidden="true" /> Back to community
				</Link>

				<div className="mt-12 flex flex-col items-center text-center">
					<div className="rounded-3xl border-4 border-white bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-800 dark:shadow-black/20">
						<Avatar src={user.image} name={user.name} size="lg" />
					</div>
					<p className="mt-6 text-sm font-semibold text-accent-700 dark:text-accent-400">
						@{user.username}
					</p>
					<h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
						{user.name}
					</h1>
					<p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
						<CalendarDays size={16} aria-hidden="true" /> Member since{" "}
						{joinedDateFormatter.format(new Date(user.createdAt))}
					</p>
				</div>
			</div>
		</header>
	);
}
