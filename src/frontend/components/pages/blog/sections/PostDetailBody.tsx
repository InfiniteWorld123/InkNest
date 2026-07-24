import type { ReactNode } from "react";
import {
	type PostContentNode,
	parseTiptapContent,
} from "#/shared/post-content";

const renderChildren = (node: PostContentNode, path: string): ReactNode =>
	node.content?.map((child, index) => renderNode(child, `${path}-${index}`)) ??
	null;

const renderMarkedText = (node: PostContentNode, key: string): ReactNode => {
	let content: ReactNode = node.text ?? "";

	for (const mark of node.marks ?? []) {
		switch (mark.type) {
			case "bold":
				content = <strong>{content}</strong>;
				break;
			case "italic":
				content = <em>{content}</em>;
				break;
			case "strike":
				content = <s>{content}</s>;
				break;
			case "code":
				content = <code>{content}</code>;
				break;
		}
	}

	return <span key={key}>{content}</span>;
};

const renderHeading = (
	node: PostContentNode,
	key: string,
	level: number,
): ReactNode => {
	const children = renderChildren(node, key);

	switch (level) {
		case 1:
			return <h1 key={key}>{children}</h1>;
		case 3:
			return <h3 key={key}>{children}</h3>;
		case 4:
			return <h4 key={key}>{children}</h4>;
		case 5:
			return <h5 key={key}>{children}</h5>;
		case 6:
			return <h6 key={key}>{children}</h6>;
		default:
			return <h2 key={key}>{children}</h2>;
	}
};

const renderNode = (node: PostContentNode, key: string): ReactNode => {
	switch (node.type) {
		case "doc":
			return renderChildren(node, key);
		case "text":
			return renderMarkedText(node, key);
		case "paragraph":
			return <p key={key}>{renderChildren(node, key)}</p>;
		case "heading":
			return renderHeading(
				node,
				key,
				typeof node.attrs?.level === "number" ? node.attrs.level : 2,
			);
		case "bulletList":
			return <ul key={key}>{renderChildren(node, key)}</ul>;
		case "orderedList":
			return (
				<ol
					key={key}
					start={
						typeof node.attrs?.start === "number" ? node.attrs.start : undefined
					}
				>
					{renderChildren(node, key)}
				</ol>
			);
		case "listItem":
			return <li key={key}>{renderChildren(node, key)}</li>;
		case "blockquote":
			return <blockquote key={key}>{renderChildren(node, key)}</blockquote>;
		case "codeBlock":
			return (
				<pre key={key}>
					<code>{renderChildren(node, key)}</code>
				</pre>
			);
		case "horizontalRule":
			return <hr key={key} />;
		case "hardBreak":
			return <br key={key} />;
		default:
			return <span key={key}>{renderChildren(node, key)}</span>;
	}
};

export function PostDetailBody({ content }: { content: string }) {
	const document = parseTiptapContent(content);

	if (document) {
		return (
			<section
				aria-labelledby="story-content-heading"
				className="px-5 py-14 sm:py-20"
			>
				<h2 id="story-content-heading" className="sr-only">
					Story
				</h2>
				<div className="prose prose-lg prose-slate mx-auto max-w-2xl dark:prose-invert">
					{renderNode(document, "document")}
				</div>
			</section>
		);
	}

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
