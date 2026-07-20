import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 dark:bg-slate-950">
			<Outlet />
		</div>
	);
}
