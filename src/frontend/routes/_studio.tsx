import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "#/frontend/api/queries/auth.query";
import { StudioHeader } from "#/frontend/components/pages/studio/sections/StudioHeader";

export const Route = createFileRoute("/_studio")({
	beforeLoad: async ({ context }) => {
		// Keep the session check here so every future Studio child is protected.
		const session = await context.queryClient.ensureQueryData(
			sessionQueryOptions(),
		);

		if (!session) {
			throw redirect({ to: "/sign-in" });
		}
	},
	component: StudioLayout,
});

function StudioLayout() {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<StudioHeader />
			<Outlet />
		</div>
	);
}
