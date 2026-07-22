import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { SignIn } from "#/frontend/components/pages/auth/pages/SignIn";
import { EmailSchema } from "#/shared/validation/auth.validation";

export const Route = createFileRoute("/_auth/sign-in")({
	component: SignIn,
	validateSearch: v.object({
		email: v.optional(EmailSchema),
		notice: v.optional(v.picklist(["verified", "password-reset"])),
	}),
});
