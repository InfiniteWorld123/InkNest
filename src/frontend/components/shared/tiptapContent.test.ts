import { describe, expect, it } from "vitest";
import {
	emptyTiptapDocument,
	parseStoredTiptapContent,
	postContentToTiptapDocument,
	tiptapDocumentHasText,
} from "./tiptapContent";

describe("Tiptap content helpers", () => {
	it("parses stored Tiptap JSON", () => {
		const document = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [{ type: "text", text: "Hello" }],
				},
			],
		};

		expect(parseStoredTiptapContent(JSON.stringify(document))).toEqual(
			document,
		);
	});

	it("converts legacy plain text into paragraphs", () => {
		expect(postContentToTiptapDocument("First\n\nSecond")).toEqual({
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [{ type: "text", text: "First" }],
				},
				{
					type: "paragraph",
					content: [{ type: "text", text: "Second" }],
				},
			],
		});
	});

	it("detects empty and non-empty documents", () => {
		expect(tiptapDocumentHasText(emptyTiptapDocument())).toBe(false);
		expect(tiptapDocumentHasText(postContentToTiptapDocument("Story"))).toBe(
			true,
		);
	});
});
