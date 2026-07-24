import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "#/frontend/api/queries/auth.query";
import { currentUserPostsQueryOptions } from "#/frontend/api/queries/post.query";
import { WriterStudioPage } from "#/frontend/components/pages/studio/pages/WriterStudioPage";

export const Route = createFileRoute("/studio")({
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.fetchQuery(sessionQueryOptions());

		if (!session) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: "/studio" },
			});
		}
	},
	loader: ({ context }) => {
		void context.queryClient.prefetchQuery(currentUserPostsQueryOptions());
	},
	component: WriterStudioPage,
});
