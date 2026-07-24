export type PostContentNode = {
	type?: string;
	text?: string;
	attrs?: Record<string, unknown>;
	marks?: Array<{
		type: string;
		attrs?: Record<string, unknown>;
	}>;
	content?: PostContentNode[];
};

export const EMPTY_POST_DOCUMENT: PostContentNode = {
	type: "doc",
	content: [{ type: "paragraph" }],
};

export const EMPTY_POST_CONTENT = JSON.stringify(EMPTY_POST_DOCUMENT);

const isPostContentNode = (value: unknown): value is PostContentNode => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const node = value as PostContentNode;
	const hasValidAttributes =
		node.attrs === undefined ||
		(typeof node.attrs === "object" &&
			node.attrs !== null &&
			!Array.isArray(node.attrs));
	const hasValidMarks =
		node.marks === undefined ||
		(Array.isArray(node.marks) &&
			node.marks.every(
				(mark) =>
					typeof mark === "object" &&
					mark !== null &&
					typeof mark.type === "string" &&
					(mark.attrs === undefined ||
						(typeof mark.attrs === "object" &&
							mark.attrs !== null &&
							!Array.isArray(mark.attrs))),
			));

	return (
		(node.type === undefined || typeof node.type === "string") &&
		(node.text === undefined || typeof node.text === "string") &&
		hasValidAttributes &&
		hasValidMarks &&
		(node.content === undefined ||
			(Array.isArray(node.content) && node.content.every(isPostContentNode)))
	);
};

export const parseTiptapContent = (content: string): PostContentNode | null => {
	try {
		const parsed: unknown = JSON.parse(content);

		if (
			isPostContentNode(parsed) &&
			parsed.type === "doc" &&
			Array.isArray(parsed.content)
		) {
			return parsed;
		}
	} catch {
		return null;
	}

	return null;
};

const collectText = (node: PostContentNode): string => {
	const ownText = node.text ?? (node.type === "hardBreak" ? "\n" : "");
	const childText = node.content?.map(collectText).join(" ") ?? "";

	return `${ownText} ${childText}`.trim();
};

export const hasMeaningfulPostContent = (content: string): boolean => {
	const document = parseTiptapContent(content);

	return document
		? collectText(document).trim().length > 0
		: content.trim().length > 0;
};

export const plainTextToTiptapContent = (content: string): string => {
	const paragraphs = content
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return JSON.stringify({
		type: "doc",
		content:
			paragraphs.length > 0
				? paragraphs.map((paragraph) => ({
						type: "paragraph",
						content: [{ type: "text", text: paragraph }],
					}))
				: [{ type: "paragraph" }],
	} satisfies PostContentNode);
};

export const normalizePostContentForEditor = (content: string): string =>
	parseTiptapContent(content) ? content : plainTextToTiptapContent(content);
