import { Spinner } from "@heroui/react";

export function PendingComponent() {
	return (
		<output className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
			<Spinner size="lg" color="accent" />
			<span className="sr-only">Loading…</span>
		</output>
	);
}
