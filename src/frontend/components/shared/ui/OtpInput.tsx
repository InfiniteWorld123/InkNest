import { type KeyboardEvent, useRef } from "react";

interface OtpInputProps {
	length?: number;
	label?: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	errors?: Array<string | undefined>;
}

const boxBase =
	"h-12 w-full max-w-[3.25rem] rounded-xl border border-slate-300 bg-white text-center text-lg font-semibold text-slate-900 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

const boxError =
	"border-red-400 focus:border-red-500 focus:ring-red-500/30 dark:border-red-500/70";

export function OtpInput({
	length = 6,
	label = "Verification code",
	value,
	onChange,
	onBlur,
	errors = [],
}: OtpInputProps) {
	const inputs = useRef<Array<HTMLInputElement | null>>([]);
	const digits = Array.from({ length }, (_, i) => value[i] ?? "");
	const messages = errors.filter((message): message is string =>
		Boolean(message),
	);
	const hasError = messages.length > 0;

	function focusAt(index: number) {
		const el = inputs.current[index];
		if (el) el.focus();
	}

	function handleChange(index: number, raw: string) {
		const digit = raw.replace(/\D/g, "").slice(-1);
		const nextDigits = [...digits];
		nextDigits[index] = digit;
		onChange(nextDigits.join(""));
		if (digit && index < length - 1) focusAt(index + 1);
	}

	function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Backspace" && !digits[index] && index > 0) {
			focusAt(index - 1);
		}
	}

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
				{label}
			</span>
			<div className="flex justify-between gap-2">
				{digits.map((digit, i) => (
					<input
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static field set
						key={i}
						ref={(el) => {
							inputs.current[i] = el;
						}}
						type="text"
						inputMode="numeric"
						maxLength={1}
						value={digit}
						aria-label={`Digit ${i + 1}`}
						aria-invalid={hasError}
						onChange={(e) => handleChange(i, e.target.value)}
						onKeyDown={(e) => handleKeyDown(i, e)}
						onBlur={onBlur}
						className={`${boxBase} ${hasError ? boxError : ""}`}
					/>
				))}
			</div>
			{hasError ? (
				<p className="text-xs text-red-600 dark:text-red-400">{messages[0]}</p>
			) : null}
		</div>
	);
}
