import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { VerifyEmail } from "#/frontend/components/pages/auth/pages/VerifyEmail";
import { EmailSchema } from "#/shared/validation/auth.validation";

export const Route = createFileRoute("/_auth/verify-email")({
	component: VerifyEmail,
	validateSearch: v.object({
		email: v.optional(EmailSchema),
	}),
});
