export function PostDetailBody({ content }: { content: string }) {
	const paragraphs = content
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
			<div className="mx-auto max-w-2xl space-y-7">
				{paragraphs.map((paragraph, index) => (
					<p
						key={paragraph}
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
		</section>
	);
}
