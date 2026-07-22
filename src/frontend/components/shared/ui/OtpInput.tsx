import { FieldError, InputOTP, Label, REGEXP_ONLY_DIGITS } from "@heroui/react";
import { useId } from "react";

interface OtpInputProps {
	length?: number;
	label?: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	errors?: Array<string | undefined>;
}

export function OtpInput({
	length = 6,
	label = "Verification code",
	value,
	onChange,
	onBlur,
	errors = [],
}: OtpInputProps) {
	const inputId = useId();
	const messages = errors.filter((message): message is string =>
		Boolean(message),
	);
	const hasError = messages.length > 0;

	return (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor={inputId}>{label}</Label>
			<InputOTP
				id={inputId}
				maxLength={length}
				pattern={REGEXP_ONLY_DIGITS}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				isInvalid={hasError}
				validationErrors={messages}
				className="w-full"
			>
				<InputOTP.Group className="flex w-full justify-between gap-2">
					{Array.from({ length }, (_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: OTP slots are a fixed ordered field set
						<InputOTP.Slot key={index} index={index} className="flex-1" />
					))}
				</InputOTP.Group>
			</InputOTP>
			{hasError ? <FieldError>{messages[0]}</FieldError> : null}
		</div>
	);
}
