import { Button, Form } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useResetPasswordMutation } from "#/frontend/api/queries/auth.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { AuthMessage } from "#/frontend/components/pages/auth/sections/AuthMessage";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { OtpInput } from "#/frontend/components/shared/ui/OtpInput";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import { ResetPasswordSchema } from "#/shared/validation/auth.validation";

const resetPasswordRoute = getRouteApi("/_auth/reset-password");

export function ResetPassword() {
	const search = resetPasswordRoute.useSearch();
	const navigate = useNavigate();
	const resetPassword = useResetPasswordMutation();
	const [submissionError, setSubmissionError] = useState<string | null>(null);
	const form = useForm({
		defaultValues: {
			email: search.email ?? "",
			otp: "",
			newPassword: "",
			confirmPassword: "",
		},
		validators: {
			onChange: ResetPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			setSubmissionError(null);

			try {
				await resetPassword.mutateAsync(value);
				await navigate({
					to: "/sign-in",
					search: { email: value.email, notice: "password-reset" },
				});
			} catch (error) {
				setSubmissionError(
					getCaughtErrorMessage(
						error,
						"Unable to reset your password. Check the code and try again.",
					),
				);
			}
		},
	});

	return (
		<AuthShell
			title="Reset your password"
			subtitle={
				search.email
					? `Enter the code sent to ${search.email} and choose a new password.`
					: "Request a reset code first so we know which account to update."
			}
			footer={
				<>
					Remembered it?{" "}
					<Link to="/sign-in" className={authLinkClass}>
						Sign in
					</Link>
				</>
			}
		>
			{submissionError ? (
				<AuthMessage
					status="danger"
					title="Password reset failed"
					message={submissionError}
				/>
			) : null}
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-5"
			>
				<form.Field name="otp">
					{(field) => (
						<OtpInput
							value={field.state.value}
							onChange={(value) => field.handleChange(value)}
							onBlur={field.handleBlur}
							errors={
								field.state.meta.isTouched
									? field.state.meta.errors.map((error) => error?.message)
									: []
							}
						/>
					)}
				</form.Field>
				<form.Field name="newPassword">
					{(field) => (
						<TextField
							label="New password"
							name={field.name}
							type="password"
							autoComplete="new-password"
							placeholder="••••••••••••"
							hint="At least 12 characters, with an uppercase letter, a number, and a special character."
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
				<form.Field name="confirmPassword">
					{(field) => (
						<TextField
							label="Confirm new password"
							name={field.name}
							type="password"
							autoComplete="new-password"
							placeholder="••••••••••••"
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
					isDisabled={!search.email || resetPassword.isPending}
					isPending={resetPassword.isPending}
				>
					{resetPassword.isPending ? "Resetting password…" : "Reset password"}
				</Button>
			</Form>
		</AuthShell>
	);
}
