import { createFileRoute } from "@tanstack/react-router";
import { ForgotPassword } from "#/frontend/components/pages/auth/pages/ForgotPassword";

export const Route = createFileRoute("/_auth/forgot-password")({
	component: ForgotPassword,
});
