import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import * as v from "valibot";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import { EmailSchema } from "#/shared/validation/auth.validation";

const SignInFormSchema = v.object({
	email: EmailSchema,
	password: v.pipe(v.string(), v.minLength(1, "Password is required")),
	rememberMe: v.boolean(),
});

export function SignIn() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
		validators: {
			onChange: SignInFormSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

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
			<form
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
							<label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
								<input
									type="checkbox"
									name={field.name}
									checked={field.state.value}
									onChange={(e) => field.handleChange(e.target.checked)}
									className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500 dark:border-slate-600 dark:bg-slate-800"
								/>
								Remember me
							</label>
						)}
					</form.Field>
					<Link to="/forgot-password" className={authLinkClass}>
						Forgot password?
					</Link>
				</div>

				<Button type="submit" fullWidth>
					Sign in
				</Button>
			</form>
		</AuthShell>
	);
}
