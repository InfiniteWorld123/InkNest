import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { ResetPassword } from "#/frontend/components/pages/auth/pages/ResetPassword";
import { EmailSchema } from "#/shared/validation/auth.validation";

export const Route = createFileRoute("/_auth/reset-password")({
	component: ResetPassword,
	validateSearch: v.object({
		email: v.optional(EmailSchema),
	}),
});
