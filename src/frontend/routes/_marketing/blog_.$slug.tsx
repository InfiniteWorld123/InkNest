import { createFileRoute } from "@tanstack/react-router";
import { postCommentsQueryOptions } from "#/frontend/api/queries/comments.query";
import { postBySlugQueryOptions } from "#/frontend/api/queries/post.query";
import { PostDetailPage } from "#/frontend/components/pages/blog/pages/PostDetailPage";

export const Route = createFileRoute("/_marketing/blog_/$slug")({
	ssr: true,
	loader: async ({ context, params }) => {
		const postResponse = await context.queryClient.ensureQueryData(
			postBySlugQueryOptions(params.slug),
		);
		await context.queryClient.ensureInfiniteQueryData(
			postCommentsQueryOptions(postResponse.data.id),
		);

		return postResponse;
	},
	component: PostDetailPage,
});
