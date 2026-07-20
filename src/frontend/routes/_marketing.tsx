import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingFooter } from "#/frontend/components/pages/marketing/sections/MarketingFooter";
import { MarketingNav } from "#/frontend/components/pages/marketing/sections/MarketingNav";

export const Route = createFileRoute("/_marketing")({
	component: MarketingLayout,
});

function MarketingLayout() {
	return (
		<div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
			<MarketingNav />
			<main className="flex-1">
				<Outlet />
			</main>
			<MarketingFooter />
		</div>
	);
}
