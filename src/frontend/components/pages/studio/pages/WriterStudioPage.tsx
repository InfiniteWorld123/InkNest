import { CreatePostSection } from "../sections/CreatePostSection";
import { PostManagementSection } from "../sections/PostManagementSection";
import { StudioHeader } from "../sections/StudioHeader";

export function WriterStudioPage() {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<StudioHeader />
			<main className="mx-auto w-full max-w-[90rem] px-5 py-10 sm:py-14">
				<header className="max-w-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
						Writer Studio
					</p>
					<h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
						Shape your next story.
					</h1>
					<p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
						This is a static dashboard preview. It does not call your backend,
						save posts, delete posts, or upload files.
					</p>
				</header>

				<div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(22rem,0.8fr)_minmax(0,1.6fr)]">
					<CreatePostSection />
					<PostManagementSection />
				</div>

				{/*
					FUTURE PROTECTION:
					Add a session check in the /studio route beforeLoad function.
					If there is no user session, redirect to /sign-in.

					PUBLIC POST NOTE:
					The current public post page expects plain text. Before saving Tiptap
					JSON, update that page to parse and safely render the JSON document.
				*/}
			</main>
		</div>
	);
}
