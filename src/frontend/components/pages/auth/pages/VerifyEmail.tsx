import { Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import type { FormEvent } from "react";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { OtpInput } from "#/frontend/components/shared/ui/OtpInput";

export function VerifyEmail() {
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

	return (
		<AuthShell
			title="Verify your email"
			subtitle="Enter the 6-digit code we sent to your inbox."
			footer={
				<>
					Wrong email?{" "}
					<Link to="/sign-up" className={authLinkClass}>
						Go back
					</Link>
				</>
			}
		>
			<div className="mb-6 flex justify-center">
				<span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
					<MailCheck size={24} />
				</span>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<OtpInput />

				<Button type="submit" fullWidth>
					Verify email
				</Button>

				<div className="text-center text-sm text-slate-600 dark:text-slate-400">
					Didn't get a code?{" "}
					<button type="button" className={authLinkClass}>
						Resend code
					</button>
				</div>

				<p className="text-center text-xs text-slate-500 dark:text-slate-500">
					The code expires in 5 minutes. You have up to 3 attempts.
				</p>
			</form>
		</AuthShell>
	);
}
