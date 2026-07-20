import { Link } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
	footer?: ReactNode;
}

export function AuthShell({
	title,
	subtitle,
	children,
	footer,
}: AuthShellProps) {
	return (
		<div className="w-full max-w-md">
			<div className="flex flex-col items-center text-center">
				<Link to="/" className="flex items-center gap-2">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600 text-white dark:bg-accent-500">
						<Feather size={20} />
					</span>
					<span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
						InkNest
					</span>
				</Link>
			</div>

			<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
				<div className="text-center">
					<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
						{title}
					</h1>
					{subtitle ? (
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
							{subtitle}
						</p>
					) : null}
				</div>

				<div className="mt-7">{children}</div>
			</div>

			{footer ? (
				<div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
					{footer}
				</div>
			) : null}
		</div>
	);
}

export const authLinkClass =
	"font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300";
