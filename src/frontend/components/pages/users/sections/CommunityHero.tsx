import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { Search, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

const usersRoute = getRouteApi("/_marketing/users");
const SEARCH_DEBOUNCE_MS = 400;

export function CommunityHero() {
	const search = usersRoute.useSearch();
	const navigate = useNavigate();
	const [query, setQuery] = useState(search.search ?? "");

	useEffect(() => {
		setQuery(search.search ?? "");
	}, [search.search]);

	useEffect(() => {
		const nextSearch = query.trim();

		if (nextSearch === (search.search ?? "")) return;

		const timeout = window.setTimeout(() => {
			void navigate({
				to: "/users",
				replace: true,
				search: { search: nextSearch || undefined },
			});
		}, SEARCH_DEBOUNCE_MS);

		return () => window.clearTimeout(timeout);
	}, [navigate, query, search.search]);

	return (
		<section className="relative border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
			<div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-700/10" />
			<div className="absolute -bottom-36 -left-20 h-64 w-64 rounded-full bg-accent-100/60 blur-3xl dark:bg-accent-800/10" />

			<div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
				<div className="max-w-2xl">
					<span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-700 dark:border-accent-800 dark:bg-slate-900 dark:text-accent-300">
						<UsersRound size={14} aria-hidden="true" /> InkNest community
					</span>
					<h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
						Meet the people behind the words.
					</h1>
					<p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
						Discover thoughtful writers, curious readers, and the voices making
						InkNest feel like home.
					</p>
				</div>

				<div className="mt-9 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-950">
					<Search
						size={18}
						className="ml-2 shrink-0 text-slate-400"
						aria-hidden="true"
					/>
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						aria-label="Search community members"
						placeholder="Search by name or username"
						className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
					/>
				</div>
			</div>
		</section>
	);
}
