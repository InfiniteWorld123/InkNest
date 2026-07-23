import { buttonVariants } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, Feather } from "lucide-react";

export function StudioHeader() {
	return (
		<header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/90">
			<div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-5">
				<Link to="/" className="flex min-w-0 items-center gap-3">
					<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white dark:bg-accent-500">
						<Feather size={18} aria-hidden="true" />
					</span>
					<span className="min-w-0">
						<span className="block truncate text-base font-semibold tracking-tight text-slate-900 dark:text-white">
							InkNest
						</span>
						<span className="block truncate text-xs text-slate-500 dark:text-slate-400">
							Writer Studio
						</span>
					</span>
				</Link>

				<Link
					to="/blog"
					className={buttonVariants({ variant: "secondary", size: "sm" })}
				>
					<BookOpen size={16} aria-hidden="true" />
					<span className="hidden sm:inline">View blog</span>
					<ArrowUpRight size={15} aria-hidden="true" />
				</Link>
			</div>
		</header>
	);
}
