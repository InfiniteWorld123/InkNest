import { Button, Form } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import {
	useSendEmailOtpMutation,
	useVerifyEmailMutation,
} from "#/frontend/api/queries/auth.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { AuthMessage } from "#/frontend/components/pages/auth/sections/AuthMessage";
import {
	AuthShell,
	authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { OtpInput } from "#/frontend/components/shared/ui/OtpInput";
import { VerifyEmailSchema } from "#/shared/validation/auth.validation";

const OTP_LENGTH = 6;

const verifyEmailRoute = getRouteApi("/_auth/verify-email");

export function VerifyEmail() {
	const search = verifyEmailRoute.useSearch();
	const navigate = useNavigate();
	const verifyEmail = useVerifyEmailMutation();
	const sendEmailOtp = useSendEmailOtpMutation();
	const [submissionError, setSubmissionError] = useState<string | null>(null);
	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const form = useForm({
		defaultValues: {
			email: search.email ?? "",
			otp: "",
		},
		validators: {
			onChange: VerifyEmailSchema,
		},
		onSubmit: async ({ value }) => {
			setSubmissionError(null);
			setResendMessage(null);

			try {
				await verifyEmail.mutateAsync(value);
				await navigate({
					to: "/sign-in",
					search: { email: value.email, notice: "verified" },
				});
			} catch (error) {
				setSubmissionError(
					getCaughtErrorMessage(
						error,
						"Unable to verify your email. Please check the code and try again.",
					),
				);
			}
		},
	});

	const handleResend = async () => {
		if (!search.email) {
			setSubmissionError(
				"Return to sign up so we know where to send the code.",
			);
			return;
		}

		setSubmissionError(null);
		setResendMessage(null);

		try {
			await sendEmailOtp.mutateAsync({
				email: search.email,
				type: "email-verification",
			});
			setResendMessage("A new verification code was sent to your email.");
		} catch (error) {
			setSubmissionError(
				getCaughtErrorMessage(error, "Unable to resend the code right now."),
			);
		}
	};

	return (
		<AuthShell
			title="Verify your email"
			subtitle={
				search.email
					? `Enter the 6-digit code we sent to ${search.email}.`
					: "Open this page from sign up, or return and enter your email again."
			}
			footer={
				<>
					Wrong email?{" "}
					<Link to="/sign-up" className={authLinkClass}>
						Go back
					</Link>
				</>
			}
		>
			{submissionError ? (
				<AuthMessage
					status="danger"
					title="Verification failed"
					message={submissionError}
				/>
			) : null}
			{resendMessage ? (
				<AuthMessage
					status="success"
					title="Code sent"
					message={resendMessage}
				/>
			) : null}
			<div className="mb-6 flex justify-center">
				<span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
					<MailCheck size={24} />
				</span>
			</div>

			<Form
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

				<Button
					type="submit"
					fullWidth
					isDisabled={!search.email || verifyEmail.isPending}
					isPending={verifyEmail.isPending}
				>
					{verifyEmail.isPending ? "Verifying…" : "Verify email"}
				</Button>

				<div className="text-center text-sm text-slate-600 dark:text-slate-400">
					Didn't get a code?{" "}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className={authLinkClass}
						onPress={handleResend}
						isDisabled={!search.email || sendEmailOtp.isPending}
						isPending={sendEmailOtp.isPending}
					>
						{sendEmailOtp.isPending ? "Sending…" : "Resend code"}
					</Button>
				</div>

				<p className="text-center text-xs text-slate-500 dark:text-slate-500">
					The code expires in 5 minutes. You have up to 3 attempts.
				</p>
			</Form>
		</AuthShell>
	);
}
