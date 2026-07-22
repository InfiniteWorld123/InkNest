import { Button, Skeleton } from "@heroui/react";
import {
	QueryErrorResetBoundary,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { CatchBoundary, getRouteApi, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Suspense } from "react";
import {
	listUsersQueryOptions,
	type PublicUser,
	userByUsernameQueryOptions,
} from "#/frontend/api/queries/users.query";
import { Avatar } from "#/frontend/components/shared/ui/Avatar";

const usersRoute = getRouteApi("/_marketing/users");
const joinedDateFormatter = new Intl.DateTimeFormat("en", {
	month: "short",
	year: "numeric",
});

export function CommunityUsersBoundary() {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<CatchBoundary
					getResetKey={() => "community-users"}
					onCatch={reset}
					errorComponent={({ error, reset: resetBoundary }) => (
						<CommunityUsersError
							error={error}
							onRetry={() => {
								reset();
								resetBoundary();
							}}
						/>
					)}
				>
					<Suspense fallback={<CommunityUsersPending />}>
						<CommunityUsersContent />
					</Suspense>
				</CatchBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

function CommunityUsersContent() {
	const search = usersRoute.useSearch();
	const { data } = useSuspenseQuery(listUsersQueryOptions(search));

	return (
		<section className="mx-auto max-w-6xl px-5 py-14 sm:py-18">
			<div className="mb-7 flex items-end justify-between gap-6">
				<div>
					<p className="text-sm font-semibold text-accent-700 dark:text-accent-400">
						All members
					</p>
					<h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
						Find your next favorite voice
					</h2>
				</div>
				<p className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">
					Showing {data.data.length}{" "}
					{data.data.length === 1 ? "writer" : "writers"}
				</p>
			</div>

			{data.data.length === 0 ? (
				<p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
					No community members match your search.
				</p>
			) : (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{data.data.map((user, index) => (
						<CommunityUserCard key={user.id} user={user} index={index} />
					))}
				</div>
			)}
		</section>
	);
}

function CommunityUserCard({
	user,
	index,
}: {
	user: PublicUser;
	index: number;
}) {
	const queryClient = useQueryClient();
	const prefetchUser = () => {
		void queryClient.prefetchQuery(userByUsernameQueryOptions(user.username));
	};

	return (
		<article className="group relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-800">
			<div
				className={`absolute inset-x-0 top-0 h-1 ${
					index % 3 === 0
						? "bg-accent-400"
						: index % 3 === 1
							? "bg-amber-300"
							: "bg-rose-300"
				}`}
			/>

			<div className="flex items-start justify-between gap-4">
				<Avatar src={user.image} name={user.name} size="lg" />
				<ArrowUpRight
					size={19}
					className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-600 dark:text-slate-600 dark:group-hover:text-accent-400"
					aria-hidden="true"
				/>
			</div>

			<div className="mt-5">
				<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
					<Link
						to="/users/$username"
						params={{ username: user.username }}
						onMouseEnter={prefetchUser}
						onFocus={prefetchUser}
						className="after:absolute after:inset-0 focus:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-accent-500 focus-visible:after:ring-offset-2 dark:focus-visible:after:ring-offset-slate-950"
					>
						{user.name}
					</Link>
				</h3>
				<p className="mt-0.5 text-sm font-medium text-accent-700 dark:text-accent-400">
					@{user.username}
				</p>
			</div>

			<p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
				{user.bio || "This community member has not added a bio yet."}
			</p>

			<div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
				<CalendarDays size={14} aria-hidden="true" />
				Joined {joinedDateFormatter.format(new Date(user.createdAt))}
			</div>
		</article>
	);
}

function CommunityUsersPending() {
	return (
		<section className="mx-auto max-w-6xl px-5 py-14 sm:py-18" aria-busy="true">
			<span className="sr-only">Loading community members…</span>
			<div className="mb-7 space-y-2">
				<Skeleton className="h-4 w-24 rounded" />
				<Skeleton className="h-8 w-72 max-w-full rounded" />
			</div>
			<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{["one", "two", "three", "four", "five", "six"].map((id) => (
					<Skeleton key={id} className="h-72 rounded-2xl" />
				))}
			</div>
		</section>
	);
}

function CommunityUsersError({
	error,
	onRetry,
}: {
	error: Error;
	onRetry: () => void;
}) {
	return (
		<section className="mx-auto max-w-6xl px-5 py-14">
			<div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
				<h2 className="font-semibold text-red-900 dark:text-red-200">
					Could not load community members
				</h2>
				<p className="mt-2 text-sm text-red-700 dark:text-red-300">
					{error.message}
				</p>
				<Button
					type="button"
					variant="danger"
					onPress={onRetry}
					className="mt-4"
				>
					Try again
				</Button>
			</div>
		</section>
	);
}
