import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { TextField } from "#/frontend/components/shared/ui/TextField";

export function SignIn() {
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

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
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<TextField
					label="Email"
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
				/>
				<TextField
					label="Password"
					name="password"
					type="password"
					autoComplete="current-password"
					placeholder="••••••••••••"
				/>

				<div className="flex items-center justify-between">
					<label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
						<input
							type="checkbox"
							name="rememberMe"
							className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500 dark:border-slate-600 dark:bg-slate-800"
						/>
						Remember me
					</label>
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
