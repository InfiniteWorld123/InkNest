import { createFileRoute } from "@tanstack/react-router";
import { ResetPassword } from "#/frontend/components/pages/auth/pages/ResetPassword";

export const Route = createFileRoute("/_auth/reset-password")({
	component: ResetPassword,
});
