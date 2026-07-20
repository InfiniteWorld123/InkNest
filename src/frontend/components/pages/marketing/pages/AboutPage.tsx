import { Link } from "@tanstack/react-router";
import { Compass, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "#/frontend/components/shared/ui/Button";

const values = [
	{
		icon: Sparkles,
		title: "Craft first",
		body: "We obsess over the writing experience so you can focus on the words, not the tooling.",
	},
	{
		icon: Heart,
		title: "Community over clout",
		body: "Real conversations and genuine connections matter more than vanity metrics.",
	},
	{
		icon: Shield,
		title: "Your words, your rules",
		body: "You own what you publish. We keep the platform calm, safe, and free of noise.",
	},
	{
		icon: Compass,
		title: "Made to explore",
		body: "Tags, categories, and follows help readers discover writing worth their time.",
	},
];

export function AboutPage() {
	return (
		<div>
			<section className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
				<span className="text-sm font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
					About InkNest
				</span>
				<h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
					A quiet place for loud ideas
				</h1>
				<p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
					InkNest began with a simple belief: writing on the internet should
					feel calm, human, and rewarding. We built a place where writers can
					share their thoughts without the clutter — and where readers can find
					stories that stay with them.
				</p>
			</section>

			<section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
				<div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2">
					<div>
						<h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
							Our mission
						</h2>
						<p className="mt-4 text-slate-600 dark:text-slate-300">
							To give every writer a home that respects their craft and their
							readers. We want the act of publishing to feel as good as the act
							of writing.
						</p>
					</div>
					<div>
						<h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
							Our story
						</h2>
						<p className="mt-4 text-slate-600 dark:text-slate-300">
							Frustrated by cluttered feeds and endless distractions, a small
							group of writers and builders set out to make something simpler.
							The result is InkNest — a platform shaped by the people who use it
							every day.
						</p>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-5 py-20">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
						What we value
					</h2>
					<p className="mt-4 text-slate-600 dark:text-slate-300">
						The principles that guide every decision we make.
					</p>
				</div>

				<div className="mt-14 grid gap-6 sm:grid-cols-2">
					{values.map((value) => (
						<div
							key={value.title}
							className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
						>
							<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
								<value.icon size={20} />
							</span>
							<div>
								<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
									{value.title}
								</h3>
								<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
									{value.body}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-16 text-center">
					<Link to="/sign-up">
						<Button size="lg">Join InkNest</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
