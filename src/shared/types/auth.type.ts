import type * as v from "valibot";
import type {
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SendVerificationOtpSchema,
	SignInSchema,
	SignUpSchema,
	VerifyEmailSchema,
} from "../validation/auth.validation";

export type SignUpBody = v.InferInput<typeof SignUpSchema>;
export type SignInBody = v.InferInput<typeof SignInSchema>;
export type SendVerificationOtpBody = v.InferInput<
	typeof SendVerificationOtpSchema
>;
export type VerifyEmailBody = v.InferInput<typeof VerifyEmailSchema>;
export type ForgotPasswordBody = v.InferInput<typeof ForgotPasswordSchema>;
export type ResetPasswordBody = v.InferInput<typeof ResetPasswordSchema>;
