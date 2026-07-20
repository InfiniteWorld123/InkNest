import { Eye, EyeOff } from "lucide-react";
import { type InputHTMLAttributes, useId, useState } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	hint?: string;
}

const inputBase =
	"h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

export function TextField({
	label,
	hint,
	type = "text",
	className = "",
	id,
	...props
}: TextFieldProps) {
	const generatedId = useId();
	const fieldId = id ?? generatedId;
	const isPassword = type === "password";
	const [show, setShow] = useState(false);
	const resolvedType = isPassword && show ? "text" : type;

	return (
		<div className="flex flex-col gap-1.5">
			<label
				htmlFor={fieldId}
				className="text-sm font-medium text-slate-700 dark:text-slate-300"
			>
				{label}
			</label>
			<div className="relative">
				<input
					id={fieldId}
					type={resolvedType}
					className={`${inputBase} ${isPassword ? "pr-11" : ""} ${className}`}
					{...props}
				/>
				{isPassword ? (
					<button
						type="button"
						onClick={() => setShow((v) => !v)}
						aria-label={show ? "Hide password" : "Show password"}
						className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
					>
						{show ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				) : null}
			</div>
			{hint ? (
				<p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
			) : null}
		</div>
	);
}
