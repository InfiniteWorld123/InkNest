import { createFileRoute } from "@tanstack/react-router";
import { platformStatsQueryOptions } from "#/frontend/api/queries/stats.query";
import { HomePage } from "#/frontend/components/pages/marketing/pages/HomePage";

export const Route = createFileRoute("/_marketing/")({
	component: HomePage,
	loader: async ({ context }) => {
		await context.queryClient
			.ensureQueryData(platformStatsQueryOptions())
			.catch(() => undefined);
	},
});
