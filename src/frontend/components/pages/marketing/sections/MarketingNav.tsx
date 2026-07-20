import { Link } from "@tanstack/react-router";
import { Feather, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "#/frontend/components/shared/ui/Button";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
] as const;

export function MarketingNav() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
				<Link to="/" className="flex items-center gap-2">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-white dark:bg-accent-500">
						<Feather size={18} />
					</span>
					<span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
						InkNest
					</span>
				</Link>

				<nav className="hidden items-center gap-1 md:flex">
					{links.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
							activeProps={{
								className:
									"rounded-lg px-3 py-2 text-sm font-medium text-accent-700 dark:text-accent-300",
							}}
							activeOptions={{ exact: true }}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-2 md:flex">
					<Link to="/sign-in">
						<Button variant="ghost" size="sm">
							Sign in
						</Button>
					</Link>
					<Link to="/sign-up">
						<Button size="sm">Get started</Button>
					</Link>
				</div>

				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					aria-label="Toggle menu"
					className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
				>
					{open ? <X size={20} /> : <Menu size={20} />}
				</button>
			</div>

			{open ? (
				<div className="border-t border-slate-200 px-5 py-4 md:hidden dark:border-slate-800">
					<nav className="flex flex-col gap-1">
						{links.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								onClick={() => setOpen(false)}
								className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
							>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="mt-3 flex flex-col gap-2">
						<Link to="/sign-in" onClick={() => setOpen(false)}>
							<Button variant="secondary" fullWidth>
								Sign in
							</Button>
						</Link>
						<Link to="/sign-up" onClick={() => setOpen(false)}>
							<Button fullWidth>Get started</Button>
						</Link>
					</div>
				</div>
			) : null}
		</header>
	);
}
