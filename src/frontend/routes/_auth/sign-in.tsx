import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "#/frontend/components/pages/auth/pages/SignIn";

export const Route = createFileRoute("/_auth/sign-in")({
	component: SignIn,
});
