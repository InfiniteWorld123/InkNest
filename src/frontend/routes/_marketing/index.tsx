import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "#/frontend/components/pages/marketing/pages/HomePage";

export const Route = createFileRoute("/_marketing/")({
	component: HomePage,
});
