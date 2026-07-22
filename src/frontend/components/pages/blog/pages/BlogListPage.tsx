import {
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { CatchBoundary, getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { listPostsQueryOptions } from "#/frontend/api/queries/post.query";
import { BlogFiltersSection } from "../sections/BlogFiltersSection";
import { BlogHeader } from "../sections/BlogHeader";
import { BlogPostsError } from "../sections/BlogPostsError";
import { BlogPostsPending } from "../sections/BlogPostsPending";
import { BlogPostsSection } from "../sections/BlogPostsSection";

const blogRoute = getRouteApi("/_marketing/blog");

export function BlogListPage() {
	return (
		<main className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
			<BlogHeader />
			<BlogFiltersSection />
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<CatchBoundary
						getResetKey={() => "blog-posts"}
						onCatch={reset}
						errorComponent={({ error, reset: resetBoundary }) => (
							<BlogPostsError
								error={error}
								onRetry={() => {
									reset();
									resetBoundary();
								}}
							/>
						)}
					>
						<Suspense fallback={<BlogPostsPending />}>
							<BlogPostsContent />
						</Suspense>
					</CatchBoundary>
				)}
			</QueryErrorResetBoundary>
		</main>
	);
}

function BlogPostsContent() {
	const search = blogRoute.useSearch();
	const { data } = useSuspenseQuery(listPostsQueryOptions(search));
	return <BlogPostsSection data={data.data} pagination={data.pagination} />;
}
