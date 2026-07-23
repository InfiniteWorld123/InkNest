import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import StarterKit from "@tiptap/starter-kit";
import type { ReactNode } from "react";
import { parseStoredTiptapContent } from "#/frontend/components/shared/tiptapContent";

export function PostDetailBody({ content }: { content: string }) {
	const document = parseStoredTiptapContent(content);
	let richContent: ReactNode = null;

	if (document) {
		try {
			/*
			 * Stored Tiptap JSON is rendered as React elements with the same
			 * extensions as the editor. No raw HTML is injected into the page.
			 */
			richContent = renderToReactElement({
				extensions: [StarterKit],
				content: document,
			});
		} catch {
			richContent = null;
		}
	}

	const paragraphs = richContent
		? []
		: content
				.split(/\n\s*\n/)
				.map((paragraph) => paragraph.trim())
				.filter(Boolean);

	return (
		<section
			aria-labelledby="story-content-heading"
			className="px-5 py-14 sm:py-20"
		>
			<h2 id="story-content-heading" className="sr-only">
				Story
			</h2>
			{richContent ? (
				<div className="prose prose-slate mx-auto max-w-2xl text-lg leading-8 dark:prose-invert">
					{richContent}
				</div>
			) : (
				<div className="mx-auto max-w-2xl space-y-7">
					{paragraphs.map((paragraph, index) => (
						<p
							key={`${index}-${paragraph}`}
							className={`leading-8 text-slate-700 dark:text-slate-200 ${
								index === 0
									? "text-xl font-medium leading-9 text-slate-900 sm:text-2xl sm:leading-10 dark:text-white"
									: "text-lg"
							}`}
						>
							{paragraph}
						</p>
					))}
				</div>
			)}
		</section>
	);
}
