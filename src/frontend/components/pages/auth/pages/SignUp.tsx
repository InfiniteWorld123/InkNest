import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import { SignUpSchema } from "#/shared/validation/auth.validation";

export function SignUp() {
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onChange: SignUpSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	return (
		<AuthShell
			title="Create your account"
			subtitle="Start writing and sharing on InkNest."
			footer={
				<>
					Already have an account?{" "}
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
				<form.Field name="name">
					{(field) => (
						<TextField
							label="Name"
							name={field.name}
							autoComplete="name"
							placeholder="Ada Lovelace"
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
							label="Confirm password"
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
					Create account
				</Button>
			</form>
		</AuthShell>
	);
}
