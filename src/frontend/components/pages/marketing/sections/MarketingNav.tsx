import { Button, buttonVariants } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Feather, Menu, X } from "lucide-react";
import { useState } from "react";
import {
	sessionQueryOptions,
	useSignOutMutation,
} from "#/frontend/api/queries/auth.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { usePrefetchMarketingRoute } from "#/frontend/hooks/usePrefetchMarketingRoute";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/blog", label: "Blog" },
	{ to: "/studio", label: "Studio" },
	{ to: "/users", label: "Community" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
] as const;

export function MarketingNav() {
	const [open, setOpen] = useState(false);
	const [signOutError, setSignOutError] = useState<string | null>(null);
	const { data: session } = useQuery(sessionQueryOptions());
	const signOut = useSignOutMutation();
	const prefetchRoute = usePrefetchMarketingRoute();

	const handleSignOut = async () => {
		setSignOutError(null);

		try {
			await signOut.mutateAsync();
			setOpen(false);
		} catch (error) {
			setSignOutError(
				getCaughtErrorMessage(error, "Unable to sign out. Please try again."),
			);
		}
	};

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
							onMouseEnter={() => void prefetchRoute(link.to)}
							onFocus={() => void prefetchRoute(link.to)}
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
					{session ? (
						<>
							<span className="max-w-40 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
								{session.user.name}
							</span>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onPress={handleSignOut}
								isDisabled={signOut.isPending}
								isPending={signOut.isPending}
							>
								{signOut.isPending ? "Signing out…" : "Sign out"}
							</Button>
						</>
					) : (
						<>
							<Link
								to="/sign-in"
								className={buttonVariants({ variant: "ghost", size: "sm" })}
							>
								Sign in
							</Link>
							<Link
								to="/sign-up"
								className={buttonVariants({
									variant: "primary",
									size: "sm",
								})}
							>
								Get started
							</Link>
						</>
					)}
				</div>

				<Button
					type="button"
					variant="ghost"
					isIconOnly
					onPress={() => setOpen((value) => !value)}
					aria-label="Toggle menu"
					className="md:hidden"
				>
					{open ? <X size={20} /> : <Menu size={20} />}
				</Button>
			</div>

			{open ? (
				<div className="border-t border-slate-200 px-5 py-4 md:hidden dark:border-slate-800">
					<nav className="flex flex-col gap-1">
						{links.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								onMouseEnter={() => void prefetchRoute(link.to)}
								onFocus={() => void prefetchRoute(link.to)}
								onClick={() => setOpen(false)}
								className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
							>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="mt-3 flex flex-col gap-2">
						{session ? (
							<>
								<p className="px-3 text-sm font-medium text-slate-700 dark:text-slate-200">
									Signed in as {session.user.name}
								</p>
								<Button
									type="button"
									variant="secondary"
									fullWidth
									onPress={handleSignOut}
									isDisabled={signOut.isPending}
									isPending={signOut.isPending}
								>
									{signOut.isPending ? "Signing out…" : "Sign out"}
								</Button>
							</>
						) : (
							<>
								<Link
									to="/sign-in"
									onClick={() => setOpen(false)}
									className={buttonVariants({
										variant: "secondary",
										fullWidth: true,
									})}
								>
									Sign in
								</Link>
								<Link
									to="/sign-up"
									onClick={() => setOpen(false)}
									className={buttonVariants({
										variant: "primary",
										fullWidth: true,
									})}
								>
									Get started
								</Link>
							</>
						)}
					</div>
				</div>
			) : null}

			{signOutError ? (
				<p
					role="alert"
					className="border-t border-red-200 bg-red-50 px-5 py-2 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300"
				>
					{signOutError}
				</p>
			) : null}
		</header>
	);
}
