import { createFileRoute } from "@tanstack/react-router";
import { listPostsQueryOptions } from "#/frontend/api/queries/post.query";
import {
	listCategoriesQueryOptions,
	listTagsQueryOptions,
} from "#/frontend/api/queries/taxonomy.query";
import { BlogListPage } from "#/frontend/components/pages/blog/pages/BlogListPage";
import { ListPostsQuerySchema } from "#/shared/validation/post.validation";

export const Route = createFileRoute("/_marketing/blog")({
	component: BlogListPage,
	validateSearch: ListPostsQuerySchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(listPostsQueryOptions(deps)),
			context.queryClient.ensureQueryData(listCategoriesQueryOptions()),
			context.queryClient.ensureQueryData(listTagsQueryOptions()),
		]);
	},
});
