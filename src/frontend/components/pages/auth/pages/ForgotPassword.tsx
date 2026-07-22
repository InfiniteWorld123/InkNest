import { Button, Form } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForgotPasswordMutation } from "#/frontend/api/queries/auth.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { AuthMessage } from "#/frontend/components/pages/auth/sections/AuthMessage";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import { ForgotPasswordSchema } from "#/shared/validation/auth.validation";

export function ForgotPassword() {
	const navigate = useNavigate();
	const forgotPassword = useForgotPasswordMutation();
	const [submissionError, setSubmissionError] = useState<string | null>(null);
	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onChange: ForgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			setSubmissionError(null);

			try {
				await forgotPassword.mutateAsync(value);
				await navigate({
					to: "/reset-password",
					search: { email: value.email },
				});
			} catch (error) {
				setSubmissionError(
					getCaughtErrorMessage(
						error,
						"Unable to send a reset code. Please try again.",
					),
				);
			}
		},
	});

	return (
		<AuthShell
			title="Forgot your password?"
			subtitle="Enter your email and we'll send you a reset code."
			footer={
				<Link
					to="/sign-in"
					className={`inline-flex items-center gap-1.5 ${authLinkClass}`}
				>
					<ArrowLeft size={15} /> Back to sign in
				</Link>
			}
		>
			{submissionError ? (
				<AuthMessage
					status="danger"
					title="Could not send the code"
					message={submissionError}
				/>
			) : null}
			<div className="mb-6 flex justify-center">
				<span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
					<KeyRound size={24} />
				</span>
			</div>

			<Form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-5"
			>
				<form.Field name="email">
					{(field) => (
						<TextField
							label="Email"
							name={field.name}
							type="email"
							autoComplete="email"
							placeholder="you@example.com"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							errors={
								field.state.meta.isTouched
									? field.state.meta.errors.map((error) => error?.message)
									: []
							}
						/>
					)}
				</form.Field>
				<Button
					type="submit"
					fullWidth
					isDisabled={forgotPassword.isPending}
					isPending={forgotPassword.isPending}
				>
					{forgotPassword.isPending ? "Sending code…" : "Send reset code"}
				</Button>
			</Form>
		</AuthShell>
	);
}
