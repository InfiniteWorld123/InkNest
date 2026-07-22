const skeletonIds = ["first", "second", "third"] as const;

export function BlogPostsPending() {
	return (
		<section
			aria-labelledby="posts-loading-heading"
			aria-busy="true"
			className="mt-12"
		>
			<div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
				<div>
					<p className="text-sm font-medium text-accent-600 dark:text-accent-400">
						Latest from the community
					</p>
					<h2
						id="posts-loading-heading"
						className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
					>
						All stories
					</h2>
				</div>

				<Skeleton className="h-4 w-16 rounded" />
			</div>

			<output className="mt-6 block">
				<span className="sr-only">Loading stories…</span>
				<div
					aria-hidden="true"
					className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
				>
					{skeletonIds.map((id) => (
						<Card key={id} className="min-h-56">
							<Card.Content className="flex h-full flex-col p-6">
								<Skeleton className="h-6 w-4/5 rounded" />
								<Skeleton className="mt-3 h-4 w-full rounded" />
								<Skeleton className="mt-2 h-4 w-2/3 rounded" />

								<div className="mt-auto flex items-end justify-between gap-4 pt-8">
									<div className="space-y-2">
										<Skeleton className="h-4 w-24 rounded" />
										<Skeleton className="h-3 w-16 rounded" />
									</div>
									<div className="flex gap-3">
										<Skeleton className="h-4 w-8 rounded" />
										<Skeleton className="h-4 w-8 rounded" />
										<Skeleton className="h-4 w-8 rounded" />
									</div>
								</div>
							</Card.Content>
						</Card>
					))}
				</div>
			</output>
		</section>
	);
}

import { Card, Skeleton } from "@heroui/react";
