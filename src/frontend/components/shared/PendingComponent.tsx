import { LoaderCircle } from "lucide-react";

export function PendingComponent() {
	return (
		<output className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
			<LoaderCircle
				size={32}
				className="animate-spin text-accent-600 dark:text-accent-400"
			/>
			<span className="sr-only">Loading…</span>
		</output>
	);
}
