import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type {
	ForgotPasswordBody,
	ResetPasswordBody,
	SendVerificationOtpBody,
	SignInBody,
	SignUpBody,
	VerifyEmailBody,
} from "#/shared/types/auth.type";
import { getErrorMessage } from "../utils";

export const authKeys = {
	all: ["auth"] as const,
	session: () => [...authKeys.all, "session"] as const,
};

export const sessionQueryOptions = () =>
	queryOptions({
		queryKey: authKeys.session(),
		queryFn: async () => {
			const result = await safe_API().auth.session.get();

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to load your session"),
				);
			}

			return result.data.data;
		},
	});

export const useSignUpMutation = () => {
	return useMutation({
		mutationFn: async (body: SignUpBody) => {
			const result = await safe_API().auth["sign-up"].post(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to sign up"));
			}

			return result.data.data;
		},
	});
};

export const useSignInMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: SignInBody) => {
			const result = await safe_API().auth["sign-in"].post(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to sign in"));
			}

			return result.data.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
	});
};

export const useVerifyEmailMutation = () => {
	return useMutation({
		mutationFn: async (body: VerifyEmailBody) => {
			const result = await safe_API().auth["verify-email"].post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to verify email"),
				);
			}

			return result.data.data;
		},
	});
};

export const useSendEmailOtpMutation = () => {
	return useMutation({
		mutationFn: async (body: SendVerificationOtpBody) => {
			const result = await safe_API().auth["send-verification-otp"].post(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to send OTP"));
			}

			return result.data.data;
		},
	});
};

export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationFn: async (body: ForgotPasswordBody) => {
			const result = await safe_API().auth["forgot-password"].post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to send a reset password link"),
				);
			}

			return result.data.data;
		},
	});
};

export const useResetPasswordMutation = () => {
	return useMutation({
		mutationFn: async (body: ResetPasswordBody) => {
			const result = await safe_API().auth["reset-password"].post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to reset the password"),
				);
			}

			return result.data.data;
		},
	});
};

export const useSignOutMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await safe_API().auth["sign-out"].post();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to sign out"));
			}

			return result.data.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
	});
};
