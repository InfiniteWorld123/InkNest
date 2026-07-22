import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { listPostsQueryOptions } from "#/frontend/api/queries/post.query";
import type { ListPostsQuery } from "#/shared/types/post.type";

const blogRoute = getRouteApi("/_marketing/blog");

export function usePrefetchBlogPosts() {
	const queryClient = useQueryClient();
	const search = blogRoute.useSearch();

	return useCallback(
		(changes: Partial<ListPostsQuery>) =>
			queryClient.prefetchQuery(
				listPostsQueryOptions({ ...search, ...changes }),
			),
		[queryClient, search],
	);
}
