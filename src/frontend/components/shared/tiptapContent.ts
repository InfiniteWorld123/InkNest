import type { JSONContent } from "@tiptap/core";

export const emptyTiptapDocument = (): JSONContent => ({
	type: "doc",
	content: [{ type: "paragraph" }],
});

export const parseStoredTiptapContent = (
	content: string,
): JSONContent | null => {
	try {
		const parsed: unknown = JSON.parse(content);

		if (
			typeof parsed === "object" &&
			parsed !== null &&
			"type" in parsed &&
			parsed.type === "doc" &&
			"content" in parsed &&
			Array.isArray(parsed.content)
		) {
			return parsed as JSONContent;
		}
	} catch {
		return null;
	}

	return null;
};

export const postContentToTiptapDocument = (content: string): JSONContent => {
	const storedDocument = parseStoredTiptapContent(content);

	if (storedDocument) {
		return storedDocument;
	}

	const paragraphs = content
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	if (paragraphs.length === 0) {
		return emptyTiptapDocument();
	}

	return {
		type: "doc",
		content: paragraphs.map((paragraph) => ({
			type: "paragraph",
			content: [{ type: "text", text: paragraph }],
		})),
	};
};

export const tiptapDocumentHasText = (document: JSONContent): boolean => {
	if (typeof document.text === "string" && document.text.trim() !== "") {
		return true;
	}

	return (
		document.content?.some((child) => tiptapDocumentHasText(child)) ?? false
	);
};
