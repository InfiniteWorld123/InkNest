import { createFileRoute } from "@tanstack/react-router";
import { currentUserPostsQueryOptions } from "#/frontend/api/queries/post.query";
import { WriterStudioPage } from "#/frontend/components/pages/studio/pages/WriterStudioPage";

export const Route = createFileRoute("/_studio/studio")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(currentUserPostsQueryOptions()),
	component: WriterStudioPage,
});
