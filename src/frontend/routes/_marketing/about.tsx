import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "#/frontend/components/pages/marketing/pages/AboutPage";

export const Route = createFileRoute("/_marketing/about")({
	component: AboutPage,
});
