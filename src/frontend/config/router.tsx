import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ErrorComponent } from "#/frontend/components/shared/ErrorComponent";
import { NotFoundComponent } from "#/frontend/components/shared/NotFoundComponent";
import { PendingComponent } from "#/frontend/components/shared/PendingComponent";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient();

	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: ErrorComponent,
		defaultNotFoundComponent: NotFoundComponent,
		defaultPendingComponent: PendingComponent,
		context: {
			queryClient,
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
