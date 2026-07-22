import { Button } from "@heroui/react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PostsPagination } from "#/frontend/api/queries/post.query";
import { createBlogSearchParams } from "../blogSearch";
import { usePrefetchBlogPosts } from "../hooks/usePrefetchBlogPosts";

const blogRoute = getRouteApi("/_marketing/blog");

export function BlogPagination({
	pagination,
}: {
	pagination: PostsPagination;
}) {
	const navigate = useNavigate();
	const prefetchPosts = usePrefetchBlogPosts();
	const search = blogRoute.useSearch();

	const goToPage = (page: number) => {
		void navigate({
			to: "/blog",
			search: createBlogSearchParams(search, { page }),
		});
	};

	return (
		<nav
			aria-label="Post pagination"
			className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800"
		>
			<Button
				type="button"
				variant="outline"
				isDisabled={!pagination.hasPreviousPage}
				onHoverStart={() => {
					if (pagination.hasPreviousPage) {
						void prefetchPosts({ page: pagination.page - 1 });
					}
				}}
				onFocus={() => {
					if (pagination.hasPreviousPage) {
						void prefetchPosts({ page: pagination.page - 1 });
					}
				}}
				onPress={() => goToPage(pagination.page - 1)}
			>
				<ChevronLeft size={16} aria-hidden="true" />
				Previous
			</Button>

			<div className="text-center text-sm text-slate-600 dark:text-slate-400">
				<span className="font-medium text-slate-900 dark:text-white">
					Page {pagination.page}
				</span>{" "}
				of {pagination.totalPages}
			</div>

			<Button
				type="button"
				variant="outline"
				isDisabled={!pagination.hasNextPage}
				onHoverStart={() => {
					if (pagination.hasNextPage) {
						void prefetchPosts({ page: pagination.page + 1 });
					}
				}}
				onFocus={() => {
					if (pagination.hasNextPage) {
						void prefetchPosts({ page: pagination.page + 1 });
					}
				}}
				onPress={() => goToPage(pagination.page + 1)}
			>
				Next
				<ChevronRight size={16} aria-hidden="true" />
			</Button>
		</nav>
	);
}
