import { Link } from "@tanstack/react-router";
import { Feather, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "#/frontend/components/shared/ui/Button";

interface ErrorComponentProps {
	error?: unknown;
	message?: string;
	reset?: () => void;
}

function resolveMessage(error: unknown): string | undefined {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return undefined;
}

export function ErrorComponent({ error, message, reset }: ErrorComponentProps) {
	const description =
		message ??
		resolveMessage(error) ??
		"Something on our end broke. Try again, or head back home.";
	const handleRetry = reset ?? (() => window.location.reload());

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 py-12 dark:bg-slate-950">
			<div className="w-full max-w-md text-center">
				<Link to="/" className="inline-flex items-center gap-2">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600 text-white dark:bg-accent-500">
						<Feather size={20} />
					</span>
					<span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
						InkNest
					</span>
				</Link>

				<div className="mt-8 flex justify-center">
					<span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
						<TriangleAlert size={24} />
					</span>
				</div>

				<h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
					Something went wrong
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					{description}
				</p>

				<div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
					<Link
						to="/"
						className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
					>
						Go home
					</Link>
					<Button onClick={handleRetry}>
						<RotateCcw size={16} />
						Try again
					</Button>
				</div>
			</div>
		</div>
	);
}
