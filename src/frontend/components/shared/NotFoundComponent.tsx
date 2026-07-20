import { Link } from "@tanstack/react-router";
import { Compass, Feather } from "lucide-react";

export function NotFoundComponent() {
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
					<span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
						<Compass size={24} />
					</span>
				</div>

				<p className="mt-6 text-sm font-semibold tracking-wide text-accent-600 dark:text-accent-400">
					404
				</p>
				<h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
					Page not found
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					The page you're looking for doesn't exist or may have moved.
				</p>

				<div className="mt-8 flex justify-center">
					<Link
						to="/"
						className="inline-flex h-11 items-center justify-center rounded-xl bg-accent-600 px-5 text-sm font-medium text-white transition-colors hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-400"
					>
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}
