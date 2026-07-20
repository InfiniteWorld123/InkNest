import { Link } from "@tanstack/react-router";
import { ArrowLeft, KeyRound } from "lucide-react";
import type { FormEvent } from "react";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { TextField } from "#/frontend/components/shared/ui/TextField";

export function ForgotPassword() {
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

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
			<div className="mb-6 flex justify-center">
				<span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
					<KeyRound size={24} />
				</span>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<TextField
					label="Email"
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
				/>
				<Button type="submit" fullWidth>
					Send reset code
				</Button>
			</form>
		</AuthShell>
	);
}
