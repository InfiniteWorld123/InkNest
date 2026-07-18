import * as v from "valibot";

const EmailSchema = v.pipe(
	v.string(),
	v.trim(),
	v.toLowerCase(),
	v.email("Please enter a valid email address"),
);

export const PasswordSchema = v.pipe(
	v.string(),
	v.minLength(12, "Password must be at least 12 characters long"),
	v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
	v.regex(/[0-9]/, "Password must contain at least one number"),
	v.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	),
);

export const NameSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(3, "Name must be at least 3 characters long"),
);

const CallbackUrlSchema = v.optional(
	v.pipe(v.string(), v.url("Callback URL must be a valid URL")),
);

const OtpSchema = v.pipe(
	v.string(),
	v.trim(),
	v.regex(/^\d{6}$/, "Verification code must be 6 digits"),
);

const OtpTypeSchema = v.union([
	v.literal("email-verification"),
	v.literal("forget-password"),
]);

export const SignUpSchema = v.pipe(
	v.object({
		name: NameSchema,
		email: EmailSchema,
		password: PasswordSchema,
		confirmPassword: v.pipe(
			v.string(),
			v.minLength(1, "Password confirmation is required"),
		),
		image: v.optional(v.pipe(v.string(), v.url("Image must be a valid URL"))),
		callbackURL: CallbackUrlSchema,
	}),
	v.forward(
		v.partialCheck(
			[["password"], ["confirmPassword"]],
			(input) => input.password === input.confirmPassword,
			"Passwords do not match",
		),
		["confirmPassword"],
	),
);

export const SignInSchema = v.object({
	email: EmailSchema,
	password: v.pipe(v.string(), v.minLength(1, "Password is required")),
	rememberMe: v.optional(v.boolean()),
	callbackURL: CallbackUrlSchema,
});

export const SendVerificationOtpSchema = v.object({
	email: EmailSchema,
	type: v.optional(OtpTypeSchema),
});

export const VerifyEmailSchema = v.object({
	email: EmailSchema,
	otp: OtpSchema,
});

export const ForgotPasswordSchema = v.object({
	email: EmailSchema,
});

export const ResetPasswordSchema = v.pipe(
	v.object({
		email: EmailSchema,
		otp: OtpSchema,
		newPassword: PasswordSchema,
		confirmPassword: v.string(),
	}),
	v.forward(
		v.partialCheck(
			[["newPassword"], ["confirmPassword"]],
			(input) => input.newPassword === input.confirmPassword,
			"Passwords do not match",
		),
		["confirmPassword"],
	),
);
