import {
	Button,
	Form,
	TextField as HeroTextField,
	Label,
	TextArea,
} from "@heroui/react";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import type { FormEvent } from "react";
import { TextField } from "#/frontend/components/shared/ui/TextField";

const details = [
	{
		icon: Mail,
		title: "Email us",
		body: "hello@inknest.com",
	},
	{
		icon: MessageSquare,
		title: "Support",
		body: "We usually reply within a day.",
	},
	{
		icon: MapPin,
		title: "Where we are",
		body: "Remote-first, everywhere.",
	},
];

export function ContactPage() {
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

	return (
		<section className="mx-auto max-w-6xl px-5 py-20 md:py-24">
			<div className="mx-auto max-w-2xl text-center">
				<span className="text-sm font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
					Contact
				</span>
				<h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
					Get in touch
				</h1>
				<p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
					Questions, feedback, or just want to say hello? We'd love to hear from
					you.
				</p>
			</div>

			<div className="mt-14 grid gap-10 lg:grid-cols-5">
				<div className="lg:col-span-2">
					<div className="flex flex-col gap-6">
						{details.map((item) => (
							<div key={item.title} className="flex gap-4">
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
									<item.icon size={20} />
								</span>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-white">
										{item.title}
									</h3>
									<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
										{item.body}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="lg:col-span-3">
					<Form
						onSubmit={handleSubmit}
						className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
					>
						<div className="grid gap-5 sm:grid-cols-2">
							<TextField label="Name" name="name" placeholder="Ada Lovelace" />
							<TextField
								label="Email"
								name="email"
								type="email"
								placeholder="you@example.com"
							/>
						</div>
						<div className="mt-5">
							<TextField
								label="Subject"
								name="subject"
								placeholder="How can we help?"
							/>
						</div>
						<HeroTextField className="mt-5" fullWidth>
							<Label>Message</Label>
							<TextArea
								id="contact-message"
								name="message"
								rows={5}
								placeholder="Write your message…"
							/>
						</HeroTextField>
						<div className="mt-6">
							<Button type="submit" fullWidth>
								Send message
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</section>
	);
}
