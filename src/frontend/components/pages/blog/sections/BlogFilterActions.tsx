import { Button } from "@heroui/react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { usePrefetchBlogPosts } from "../hooks/usePrefetchBlogPosts";

const blogRoute = getRouteApi("/_marketing/blog");

export function BlogFilterActions() {
	const navigate = useNavigate();
	const prefetchPosts = usePrefetchBlogPosts();
	const search = blogRoute.useSearch();
	const hasActiveFilters = Object.values(search).some(
		(value) => value !== undefined,
	);

	return (
		<div className="flex items-end md:col-span-2 lg:col-span-4">
			<Button
				type="button"
				variant="outline"
				isDisabled={!hasActiveFilters}
				onHoverStart={() => {
					if (hasActiveFilters) {
						void prefetchPosts({
							search: undefined,
							category: undefined,
							tags: undefined,
							sortBy: undefined,
							order: undefined,
							page: undefined,
							limit: undefined,
						});
					}
				}}
				onFocus={() => {
					if (hasActiveFilters) {
						void prefetchPosts({
							search: undefined,
							category: undefined,
							tags: undefined,
							sortBy: undefined,
							order: undefined,
							page: undefined,
							limit: undefined,
						});
					}
				}}
				onPress={() => {
					void navigate({ to: "/blog", replace: true, search: {} });
				}}
			>
				<RotateCcw size={16} aria-hidden="true" />
				Reset filters
			</Button>
		</div>
	);
}
