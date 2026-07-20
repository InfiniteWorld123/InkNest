import { type KeyboardEvent, useRef } from "react";

interface OtpInputProps {
	length?: number;
	label?: string;
}

export function OtpInput({
	length = 6,
	label = "Verification code",
}: OtpInputProps) {
	const inputs = useRef<Array<HTMLInputElement | null>>([]);

	function focusAt(index: number) {
		const el = inputs.current[index];
		if (el) el.focus();
	}

	function handleChange(index: number, value: string) {
		const digit = value.replace(/\D/g, "").slice(-1);
		const el = inputs.current[index];
		if (el) el.value = digit;
		if (digit && index < length - 1) focusAt(index + 1);
	}

	function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
			focusAt(index - 1);
		}
	}

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
				{label}
			</span>
			<div className="flex justify-between gap-2">
				{Array.from({ length }).map((_, i) => (
					<input
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static field set
						key={i}
						ref={(el) => {
							inputs.current[i] = el;
						}}
						type="text"
						inputMode="numeric"
						maxLength={1}
						aria-label={`Digit ${i + 1}`}
						onChange={(e) => handleChange(i, e.target.value)}
						onKeyDown={(e) => handleKeyDown(i, e)}
						className="h-12 w-full max-w-[3.25rem] rounded-xl border border-slate-300 bg-white text-center text-lg font-semibold text-slate-900 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
					/>
				))}
			</div>
		</div>
	);
}
