import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	ForgotPasswordBody,
	ResetPasswordBody,
	SendVerificationOtpBody,
	SignInBody,
	SignUpBody,
	VerifyEmailBody,
} from "#/shared/types/auth.type";
import {
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SendVerificationOtpSchema,
	SignInSchema,
	SignUpSchema,
	VerifyEmailSchema,
} from "#/shared/validation/auth.validation";
import {
	forgotPasswordService,
	getSessionService,
	resetPasswordService,
	sendVerificationOtpService,
	signInService,
	signOutService,
	signUpService,
	verifyEmailService,
} from "./auth.service";

export const getSession = async ({ request }: { request: Request }) => {
	const result = await getSessionService({ headers: request.headers });

	return responseOk({
		data: result,
		message: "Session retrieved successfully",
	});
};

export const signUp = async ({ body }: { body: SignUpBody }) => {
	const parsedBody = v.parse(SignUpSchema, body);
	const result = await signUpService({
		body: {
			name: parsedBody.name,
			email: parsedBody.email,
			password: parsedBody.password,
			image: parsedBody.image,
			callbackURL: parsedBody.callbackURL,
		},
	});

	return status(
		HttpStatusCode.CREATED,
		responseOk({
			data: result,
			message: "Signed up successfully",
		}),
	);
};

export const signIn = async ({ body }: { body: SignInBody }) => {
	const parsedBody = v.parse(SignInSchema, body);
	const result = await signInService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "Signed in successfully",
		}),
	);
};

export const signOut = async ({ request }: { request: Request }) => {
	const result = await signOutService({ headers: request.headers });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "Signed out successfully",
		}),
	);
};

export const sendVerificationOtp = async ({
	body,
}: {
	body: SendVerificationOtpBody;
}) => {
	const parsedBody = v.parse(SendVerificationOtpSchema, body);
	const result = await sendVerificationOtpService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "Verification code sent successfully",
		}),
	);
};

export const verifyEmail = async ({ body }: { body: VerifyEmailBody }) => {
	const parsedBody = v.parse(VerifyEmailSchema, body);
	const result = await verifyEmailService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "Email verified successfully",
		}),
	);
};

export const forgotPassword = async ({
	body,
}: {
	body: ForgotPasswordBody;
}) => {
	const parsedBody = v.parse(ForgotPasswordSchema, body);
	const result = await forgotPasswordService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "Password reset code sent successfully",
		}),
	);
};

export const resetPassword = async ({ body }: { body: ResetPasswordBody }) => {
	const parsedBody = v.parse(ResetPasswordSchema, body);
	const result = await resetPasswordService({
		body: {
			email: parsedBody.email,
			otp: parsedBody.otp,
			newPassword: parsedBody.newPassword,
		},
	});

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "Password reset successfully",
		}),
	);
};
