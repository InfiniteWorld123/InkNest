import { Feather, Quote } from "lucide-react";
import type { PublicUser } from "#/frontend/api/queries/users.query";

export function UserProfileAbout({ user }: { user: PublicUser }) {
	return (
		<section
			aria-labelledby="profile-about-heading"
			className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900"
		>
			<Quote
				size={34}
				className="absolute right-7 top-7 text-accent-200 sm:right-10 sm:top-10 dark:text-accent-900"
				aria-hidden="true"
			/>
			<h2
				id="profile-about-heading"
				className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700 dark:text-accent-400"
			>
				About the writer
			</h2>
			<p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl sm:leading-9 dark:text-slate-200">
				{user.bio || "This writer has not added a bio yet."}
			</p>

			<div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
				<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400">
					<Feather size={17} aria-hidden="true" />
				</span>
				<div>
					<p className="text-sm font-semibold text-slate-900 dark:text-white">
						InkNest member
					</p>
					<p className="text-xs text-slate-500 dark:text-slate-400">
						Writing as @{user.username}
					</p>
				</div>
			</div>
		</section>
	);
}
