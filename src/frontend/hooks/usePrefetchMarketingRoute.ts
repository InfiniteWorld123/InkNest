import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { listPostsQueryOptions } from "#/frontend/api/queries/post.query";
import { listUsersQueryOptions } from "#/frontend/api/queries/users.query";

export function usePrefetchMarketingRoute() {
	const queryClient = useQueryClient();

	return useCallback(
		(to: string) => {
			if (to === "/blog") {
				return queryClient.prefetchQuery(listPostsQueryOptions());
			}

			if (to === "/users") {
				return queryClient.prefetchQuery(listUsersQueryOptions());
			}

			return Promise.resolve();
		},
		[queryClient],
	);
}
