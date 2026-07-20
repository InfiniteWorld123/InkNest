import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "#/frontend/components/pages/auth/pages/SignUp";

export const Route = createFileRoute("/_auth/sign-up")({
	component: SignUp,
});
