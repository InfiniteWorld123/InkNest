import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { Select } from "#/frontend/components/shared/ui/Select";
import type { ListPostsQuery } from "#/shared/types/post.type";
import { createBlogSearchParams } from "../blogSearch";
import { usePrefetchBlogPosts } from "../hooks/usePrefetchBlogPosts";

const sortOptions = [
	{ value: "date", label: "Date" },
	{ value: "views", label: "Views" },
	{ value: "likes", label: "Likes" },
	{ value: "bookmarks", label: "Bookmarks" },
];

const orderOptions = [
	{ value: "desc", label: "Descending" },
	{ value: "asc", label: "Ascending" },
];

const limitOptions = [
	{ value: "10", label: "10" },
	{ value: "20", label: "20" },
	{ value: "50", label: "50" },
];

const blogRoute = getRouteApi("/_marketing/blog");

export function BlogSortFilters() {
	const navigate = useNavigate();
	const prefetchPosts = usePrefetchBlogPosts();
	const search = blogRoute.useSearch();

	const updateSearch = (changes: Partial<ListPostsQuery>) => {
		void prefetchPosts({ ...changes, page: undefined });
		void navigate({
			to: "/blog",
			replace: true,
			search: createBlogSearchParams(search, {
				...changes,
				page: undefined,
			}),
		});
	};

	return (
		<>
			<Select
				id="post-sort"
				name="sortBy"
				label="Sort by"
				options={sortOptions}
				value={search.sortBy ?? "date"}
				onValueChange={(sortBy) =>
					updateSearch({ sortBy: sortBy as ListPostsQuery["sortBy"] })
				}
				className="lg:col-span-3"
			/>
			<Select
				id="post-order"
				name="order"
				label="Order"
				options={orderOptions}
				value={search.order ?? "desc"}
				onValueChange={(order) =>
					updateSearch({ order: order as ListPostsQuery["order"] })
				}
				className="lg:col-span-3"
			/>
			<Select
				id="post-limit"
				name="limit"
				label="Per page"
				options={limitOptions}
				value={String(search.limit ?? 10)}
				onValueChange={(limit) => updateSearch({ limit: Number(limit) })}
				className="lg:col-span-2"
			/>
		</>
	);
}
