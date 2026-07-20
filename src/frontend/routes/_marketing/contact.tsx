import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "#/frontend/components/pages/marketing/pages/ContactPage";

export const Route = createFileRoute("/_marketing/contact")({
	component: ContactPage,
});
