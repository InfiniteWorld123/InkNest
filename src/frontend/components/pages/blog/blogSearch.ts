import type { ListPostsQuery } from "#/shared/types/post.type";

export type BlogSearchParams = Omit<ListPostsQuery, "page" | "limit"> & {
	page?: string;
	limit?: string;
};

export function createBlogSearchParams(
	current: ListPostsQuery,
	changes: Partial<ListPostsQuery>,
): BlogSearchParams {
	const next = { ...current, ...changes };

	return {
		search: next.search,
		category: next.category,
		tags: next.tags,
		sortBy: next.sortBy,
		order: next.order,
		page: next.page?.toString(),
		limit: next.limit?.toString(),
	};
}
