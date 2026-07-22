import { Link } from "@tanstack/react-router";

export function UserProfileExplore() {
	return (
		<aside className="mt-10 rounded-2xl bg-accent-50 px-6 py-7 text-center dark:bg-accent-500/10">
			<p className="text-sm font-semibold text-accent-900 dark:text-accent-200">
				Enjoy discovering new voices?
			</p>
			<p className="mt-1 text-sm text-accent-800/80 dark:text-accent-300/80">
				There are more thoughtful people waiting in the community.
			</p>
			<Link
				to="/users"
				className="mt-4 inline-flex rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:bg-accent-500 dark:text-slate-950"
			>
				Explore all members
			</Link>
		</aside>
	);
}
