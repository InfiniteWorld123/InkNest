import { buttonVariants, Card, Surface } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Bell,
	Bookmark,
	Heart,
	MessageCircle,
	PenLine,
	Tags,
	Users,
} from "lucide-react";

const features = [
	{
		icon: PenLine,
		title: "Write & publish",
		body: "A distraction-free editor with drafts and one-click publishing when you're ready.",
	},
	{
		icon: MessageCircle,
		title: "Threaded comments",
		body: "Readers reply, discuss, and build conversations right beneath every post.",
	},
	{
		icon: Tags,
		title: "Tags & categories",
		body: "Organize your work so the right readers can always find the right story.",
	},
	{
		icon: Heart,
		title: "Likes & bookmarks",
		body: "Let readers show appreciation and save the pieces they want to revisit.",
	},
	{
		icon: Users,
		title: "Follow authors",
		body: "Build a following and keep up with the writers whose work you love.",
	},
	{
		icon: Bell,
		title: "Notifications",
		body: "Stay in the loop on new comments, likes, follows, and replies.",
	},
];

const stats = [
	{ value: "10k+", label: "Stories published" },
	{ value: "48k+", label: "Active readers" },
	{ value: "120+", label: "Topics to explore" },
];

export function HomePage() {
	return (
		<div>
			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent-50 to-white dark:from-slate-900 dark:to-slate-950" />
				<div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
					<div className="mx-auto max-w-3xl text-center">
						<span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-white px-3 py-1 text-xs font-medium text-accent-700 dark:border-accent-800 dark:bg-slate-900 dark:text-accent-300">
							<PenLine size={13} /> Where ideas find their readers
						</span>
						<h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
							Write freely.
							<br />
							Publish beautifully.
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">
							InkNest is a calm, modern home for your writing. Draft your ideas,
							share them with the world, and grow a community around the stories
							you tell.
						</p>
						<div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link
								to="/sign-up"
								className={buttonVariants({ variant: "primary", size: "lg" })}
							>
								Start writing <ArrowRight size={18} />
							</Link>
							<Link
								to="/about"
								className={buttonVariants({ variant: "secondary", size: "lg" })}
							>
								Learn more
							</Link>
						</div>
					</div>

					<div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
									{stat.value}
								</div>
								<div className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="mx-auto max-w-6xl px-5 py-20">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
						Everything you need to tell your story
					</h2>
					<p className="mt-4 text-slate-600 dark:text-slate-300">
						From your first draft to your thousandth reader, InkNest gives you
						the tools to write, share, and connect.
					</p>
				</div>

				<div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => (
						<Card
							key={feature.title}
							className="transition-shadow hover:shadow-md"
						>
							<Card.Content className="p-6">
								<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
									<feature.icon size={20} />
								</span>
								<Card.Title className="mt-5">{feature.title}</Card.Title>
								<Card.Description className="mt-2">
									{feature.body}
								</Card.Description>
							</Card.Content>
						</Card>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-6xl px-5 pb-24">
				<Surface className="overflow-hidden rounded-3xl bg-accent-600 px-8 py-14 text-center dark:bg-accent-700">
					<Bookmark className="mx-auto text-accent-200" size={28} />
					<h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
						Your next story starts here
					</h2>
					<p className="mx-auto mt-4 max-w-md text-accent-100">
						Join thousands of writers who call InkNest home. It's free to get
						started.
					</p>
					<div className="mt-8 flex justify-center">
						<Link
							to="/sign-up"
							className={buttonVariants({ variant: "secondary", size: "lg" })}
						>
							Create your account <ArrowRight size={18} />
						</Link>
					</div>
				</Surface>
			</section>
		</div>
	);
}
