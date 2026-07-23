import { Button, Checkbox, Form, Label } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as v from "valibot";
import { useSignInMutation } from "#/frontend/api/queries/auth.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { AuthMessage } from "#/frontend/components/pages/auth/sections/AuthMessage";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import { EmailSchema } from "#/shared/validation/auth.validation";

const SignInFormSchema = v.object({
	email: EmailSchema,
	password: v.pipe(v.string(), v.minLength(1, "Password is required")),
	rememberMe: v.boolean(),
});

const signInRoute = getRouteApi("/_auth/sign-in");

export function SignIn() {
	const search = signInRoute.useSearch();
	const navigate = useNavigate();
	const signIn = useSignInMutation();
	const [submissionError, setSubmissionError] = useState<string | null>(null);
	const form = useForm({
		defaultValues: {
			email: search.email ?? "",
			password: "",
			rememberMe: false,
		},
		validators: {
			onChange: SignInFormSchema,
		},
		onSubmit: async ({ value }) => {
			setSubmissionError(null);

			try {
				await signIn.mutateAsync(value);
				await navigate({ to: "/" });
			} catch (error) {
				setSubmissionError(
					getCaughtErrorMessage(error, "Unable to sign in. Please try again."),
				);
			}
		},
	});
	const notice =
		search.notice === "verified"
			? "Your email is verified. You can sign in now."
			: search.notice === "password-reset"
				? "Your password has been reset. Sign in with your new password."
				: null;

	return (
		<AuthShell
			title="Welcome back"
			subtitle="Sign in to continue to InkNest."
			footer={
				<>
					Don't have an account?{" "}
					<Link to="/sign-up" className={authLinkClass}>
						Create one
					</Link>
				</>
			}
		>
			{notice ? (
				<AuthMessage status="success" title="You're all set" message={notice} />
			) : null}
			{submissionError ? (
				<AuthMessage
					status="danger"
					title="Sign-in failed"
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
				<form.Field name="password">
					{(field) => (
						<TextField
							label="Password"
							name={field.name}
							type="password"
							autoComplete="current-password"
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

				<div className="flex items-center justify-between">
					<form.Field name="rememberMe">
						{(field) => (
							<Checkbox
								name={field.name}
								isSelected={field.state.value}
								onChange={field.handleChange}
							>
								<Checkbox.Content>
									<Checkbox.Control>
										<Checkbox.Indicator />
									</Checkbox.Control>
									<Label>Remember me</Label>
								</Checkbox.Content>
							</Checkbox>
						)}
					</form.Field>
					<Link to="/forgot-password" className={authLinkClass}>
						Forgot password?
					</Link>
				</div>

				<Button
					type="submit"
					fullWidth
					isDisabled={signIn.isPending}
					isPending={signIn.isPending}
				>
					{signIn.isPending ? "Signing in…" : "Sign in"}
				</Button>

				<p className="text-center text-sm text-slate-600 dark:text-slate-400">
					Have a verification code?{" "}
					<form.Subscribe selector={(state) => state.values.email}>
						{(email) => (
							<Link
								to="/verify-email"
								search={{ email: email || undefined }}
								className={authLinkClass}
							>
								Verify your email
							</Link>
						)}
					</form.Subscribe>
				</p>
			</Form>
		</AuthShell>
	);
}
