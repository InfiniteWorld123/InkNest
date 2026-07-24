import { describe, expect, it } from "vitest";
import {
	EMPTY_POST_CONTENT,
	hasMeaningfulPostContent,
	normalizePostContentForEditor,
	parseTiptapContent,
	plainTextToTiptapContent,
} from "./post-content";

describe("post content helpers", () => {
	it("recognizes a Tiptap document", () => {
		const content = JSON.stringify({
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [{ type: "text", text: "A real story" }],
				},
			],
		});

		expect(parseTiptapContent(content)?.type).toBe("doc");
		expect(hasMeaningfulPostContent(content)).toBe(true);
	});

	it("rejects an empty Tiptap document as meaningful content", () => {
		expect(hasMeaningfulPostContent(EMPTY_POST_CONTENT)).toBe(false);
	});

	it("falls back safely when structured marks are malformed", () => {
		const malformed = JSON.stringify({
			type: "doc",
			content: [{ type: "text", text: "Story", marks: { type: "bold" } }],
		});

		expect(parseTiptapContent(malformed)).toBeNull();
	});

	it("converts legacy plain text into editable paragraphs", () => {
		const content = plainTextToTiptapContent("First paragraph.\n\nSecond.");
		const document = parseTiptapContent(content);

		expect(document?.content).toHaveLength(2);
		expect(document?.content?.[0]?.content?.[0]?.text).toBe("First paragraph.");
		expect(normalizePostContentForEditor("Legacy story")).toBe(
			plainTextToTiptapContent("Legacy story"),
		);
	});
});
