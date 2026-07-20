import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	fullWidth?: boolean;
}

const base =
	"inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
	primary:
		"bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 dark:bg-accent-500 dark:hover:bg-accent-400",
	secondary:
		"border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
	ghost:
		"text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
};

const sizes: Record<Size, string> = {
	sm: "h-9 px-3 text-sm",
	md: "h-11 px-5 text-sm",
	lg: "h-12 px-6 text-base",
};

export function Button({
	variant = "primary",
	size = "md",
	fullWidth = false,
	className = "",
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={`${base} ${variants[variant]} ${sizes[size]} ${
				fullWidth ? "w-full" : ""
			} ${className}`}
			{...props}
		/>
	);
}
