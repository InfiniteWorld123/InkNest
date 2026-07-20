import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import * as v from "valibot";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import { PasswordSchema } from "#/shared/validation/auth.validation";

const ResetPasswordFormSchema = v.pipe(
	v.object({
		newPassword: PasswordSchema,
		confirmPassword: v.pipe(
			v.string(),
			v.minLength(1, "Password confirmation is required"),
		),
	}),
	v.forward(
		v.partialCheck(
			[["newPassword"], ["confirmPassword"]],
			(input) => input.newPassword === input.confirmPassword,
			"Passwords do not match",
		),
		["confirmPassword"],
	),
);

export function ResetPassword() {
	const form = useForm({
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validators: {
			onChange: ResetPasswordFormSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	return (
		<AuthShell
			title="Reset your password"
			subtitle="Enter the code we emailed you and choose a new password."
			footer={
				<>
					Remembered it?{" "}
					<Link to="/sign-in" className={authLinkClass}>
						Sign in
					</Link>
				</>
			}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-5"
			>
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
				<Button type="submit" fullWidth>
					Reset password
				</Button>
			</form>
		</AuthShell>
	);
}
