import { auth } from "#/backend/shared/auth";
import type {
	ForgotPasswordBody,
	ResetPasswordBody,
	SendVerificationOtpBody,
	SignInBody,
	SignUpBody,
	VerifyEmailBody,
} from "#/shared/types/auth.type";

type SignUpInput = Omit<SignUpBody, "confirmPassword">;
type ResetPasswordInput = Omit<ResetPasswordBody, "confirmPassword">;

export const getSessionService = ({ headers }: { headers: Headers }) =>
	auth.api.getSession({ headers });

export const signUpService = ({ body }: { body: SignUpInput }) =>
	auth.api.signUpEmail({ body });

export const signInService = ({ body }: { body: SignInBody }) =>
	auth.api.signInEmail({ body });

export const signOutService = ({ headers }: { headers: Headers }) =>
	auth.api.signOut({ headers });

export const sendVerificationOtpService = ({
	body,
}: {
	body: SendVerificationOtpBody;
}) =>
	auth.api.sendVerificationOTP({
		body: {
			email: body.email,
			type: body.type ?? "email-verification",
		},
	});

export const verifyEmailService = ({ body }: { body: VerifyEmailBody }) =>
	auth.api.verifyEmailOTP({ body });

export const forgotPasswordService = ({ body }: { body: ForgotPasswordBody }) =>
	auth.api.requestPasswordResetEmailOTP({ body });

export const resetPasswordService = ({ body }: { body: ResetPasswordInput }) =>
	auth.api.resetPasswordEmailOTP({
		body: {
			email: body.email,
			otp: body.otp,
			password: body.newPassword,
		},
	});
