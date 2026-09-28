import type { PostContentNode } from "#/shared/post-content";

// Converts the small Markdown subset used by the seed posts (headings,
// paragraphs, lists, quotes, code blocks, **bold**, `code`) into the TipTap
// document format that the editor and PostDetailBody render.
const inline = (text: string): PostContentNode[] => {
	const nodes: PostContentNode[] = [];
	const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
	let lastIndex = 0;

	for (const match of text.matchAll(pattern)) {
		const index = match.index ?? 0;
		if (index > lastIndex) {
			nodes.push({ type: "text", text: text.slice(lastIndex, index) });
		}
		const token = match[0];
		nodes.push(
			token.startsWith("**")
				? { type: "text", text: token.slice(2, -2), marks: [{ type: "bold" }] }
				: { type: "text", text: token.slice(1, -1), marks: [{ type: "code" }] },
		);
		lastIndex = index + token.length;
	}
	if (lastIndex < text.length) {
		nodes.push({ type: "text", text: text.slice(lastIndex) });
	}
	return nodes;
};

const paragraph = (text: string): PostContentNode => ({
	type: "paragraph",
	content: inline(text),
});

export const markdownToTiptap = (markdown: string): PostContentNode => {
	const lines = markdown.trim().split("\n");
	const content: PostContentNode[] = [];
	let index = 0;

	while (index < lines.length) {
		const line = lines[index] ?? "";

		if (line.trim() === "") {
			index += 1;
			continue;
		}

		const heading = /^(#{1,6})\s+(.*)$/.exec(line);
		if (heading) {
			content.push({
				type: "heading",
				attrs: { level: heading[1]?.length ?? 2 },
				content: inline(heading[2] ?? ""),
			});
			index += 1;
			continue;
		}

		if (line.startsWith("```")) {
			const language = line.slice(3).trim() || null;
			const code: string[] = [];
			index += 1;
			while (index < lines.length && !(lines[index] ?? "").startsWith("```")) {
				code.push(lines[index] ?? "");
				index += 1;
			}
			index += 1;
			content.push({
				type: "codeBlock",
				attrs: { language },
				content: [{ type: "text", text: code.join("\n") }],
			});
			continue;
		}

		const listMatch = /^(-|\d+\.)\s+/.exec(line);
		if (listMatch) {
			const ordered = listMatch[1] !== "-";
			const items: PostContentNode[] = [];
			while (index < lines.length && /^(-|\d+\.)\s+/.test(lines[index] ?? "")) {
				items.push({
					type: "listItem",
					content: [
						paragraph((lines[index] ?? "").replace(/^(-|\d+\.)\s+/, "")),
					],
				});
				index += 1;
			}
			content.push({
				type: ordered ? "orderedList" : "bulletList",
				...(ordered ? { attrs: { start: 1 } } : {}),
				content: items,
			});
			continue;
		}

		if (line.startsWith(">")) {
			const quote: string[] = [];
			while (index < lines.length && (lines[index] ?? "").startsWith(">")) {
				quote.push((lines[index] ?? "").replace(/^>\s?/, ""));
				index += 1;
			}
			content.push({
				type: "blockquote",
				content: [paragraph(quote.join(" "))],
			});
			continue;
		}

		const text: string[] = [];
		while (
			index < lines.length &&
			(lines[index] ?? "").trim() !== "" &&
			!/^(#{1,6}\s|```|>|-\s|\d+\.\s)/.test(lines[index] ?? "")
		) {
			text.push((lines[index] ?? "").trim());
			index += 1;
		}
		content.push(paragraph(text.join(" ")));
	}

	return { type: "doc", content };
};
