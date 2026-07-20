import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import * as v from "valibot";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { OtpInput } from "#/frontend/components/shared/ui/OtpInput";

const OTP_LENGTH = 6;

const VerifyEmailFormSchema = v.object({
	otp: v.pipe(
		v.string(),
		v.regex(
			new RegExp(`^\\d{${OTP_LENGTH}}$`),
			`Enter all ${OTP_LENGTH} digits`,
		),
	),
});

export function VerifyEmail() {
	const form = useForm({
		defaultValues: {
			otp: "",
		},
		validators: {
			onChange: VerifyEmailFormSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

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

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-6"
			>
				<form.Field name="otp">
					{(field) => (
						<OtpInput
							length={OTP_LENGTH}
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
