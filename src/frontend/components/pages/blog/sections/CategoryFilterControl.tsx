import { Button } from "@heroui/react";
import {
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	CatchBoundary,
	getRouteApi,
	useNavigate,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { listCategoriesQueryOptions } from "#/frontend/api/queries/taxonomy.query";
import { Select } from "#/frontend/components/shared/ui/Select";
import { createBlogSearchParams } from "../blogSearch";
import { usePrefetchBlogPosts } from "../hooks/usePrefetchBlogPosts";

const blogRoute = getRouteApi("/_marketing/blog");
const ALL_CATEGORIES = "__all_categories__";

export function CategoryFilterControl() {
	return (
		<div className="lg:col-span-3">
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<CatchBoundary
						getResetKey={() => "blog-categories"}
						onCatch={reset}
						errorComponent={({ reset: resetBoundary }) => (
							<CategorySelectError
								onRetry={() => {
									reset();
									resetBoundary();
								}}
							/>
						)}
					>
						<Suspense fallback={<CategorySelectPending />}>
							<CategorySelect />
						</Suspense>
					</CatchBoundary>
				)}
			</QueryErrorResetBoundary>
		</div>
	);
}

function CategorySelect() {
	const { data } = useSuspenseQuery(listCategoriesQueryOptions());
	const navigate = useNavigate();
	const prefetchPosts = usePrefetchBlogPosts();
	const search = blogRoute.useSearch();

	const handleNavigate = (category: string) => {
		void prefetchPosts({ category: category || undefined, page: undefined });
		void navigate({
			to: "/blog",
			replace: true,
			search: createBlogSearchParams(search, {
				category: category || undefined,
				page: undefined,
			}),
		});
	};

	return (
		<Select
			id="post-category"
			name="category"
			label="Category"
			placeholder="All categories"
			value={search.category ?? ALL_CATEGORIES}
			onValueChange={(category) =>
				handleNavigate(category === ALL_CATEGORIES ? "" : category)
			}
			options={[
				{ value: ALL_CATEGORIES, label: "All categories" },
				...data.data.map((category) => ({
					value: category.slug,
					label: category.name,
				})),
			]}
		/>
	);
}

function CategorySelectPending() {
	return (
		<Select
			label="Category"
			placeholder="Loading categories…"
			options={[]}
			isDisabled
			className="animate-pulse"
		/>
	);
}

function CategorySelectError({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="flex items-end gap-2">
			<Select
				label="Category"
				placeholder="Categories unavailable"
				options={[]}
				isDisabled
				className="flex-1"
			/>
			<Button type="button" variant="danger" onPress={onRetry}>
				Retry
			</Button>
		</div>
	);
}
