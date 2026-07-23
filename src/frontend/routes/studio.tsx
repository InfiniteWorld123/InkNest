import { createFileRoute } from "@tanstack/react-router";
import { WriterStudioPage } from "#/frontend/components/pages/studio/pages/WriterStudioPage";

export const Route = createFileRoute("/studio")({
	component: WriterStudioPage,
});
