import { Link } from "@tanstack/react-router";
import { Feather } from "lucide-react";

const columns = [
	{
		title: "Product",
		links: [
			{ to: "/", label: "Home" },
			{ to: "/about", label: "About" },
			{ to: "/contact", label: "Contact" },
		],
	},
	{
		title: "Account",
		links: [
			{ to: "/sign-in", label: "Sign in" },
			{ to: "/sign-up", label: "Create account" },
			{ to: "/forgot-password", label: "Forgot password" },
		],
	},
] as const;

export function MarketingFooter() {
	return (
		<footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
			<div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 md:grid-cols-4">
				<div className="sm:col-span-2 md:col-span-2">
					<div className="flex items-center gap-2">
						<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-white dark:bg-accent-500">
							<Feather size={18} />
						</span>
						<span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
							InkNest
						</span>
					</div>
					<p className="mt-4 max-w-sm text-sm text-slate-600 dark:text-slate-400">
						A calm home for your writing. Draft, publish, and grow a readership
						— one post at a time.
					</p>
				</div>

				{columns.map((col) => (
					<div key={col.title}>
						<h3 className="text-sm font-semibold text-slate-900 dark:text-white">
							{col.title}
						</h3>
						<ul className="mt-4 space-y-3">
							{col.links.map((link) => (
								<li key={link.to}>
									<Link
										to={link.to}
										className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="border-t border-slate-200 dark:border-slate-800">
				<div className="mx-auto max-w-6xl px-5 py-6 text-sm text-slate-500 dark:text-slate-500">
					© {new Date().getFullYear()} InkNest. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
