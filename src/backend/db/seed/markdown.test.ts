import { describe, expect, it } from "vitest";
import { markdownToTiptap } from "./markdown";

describe("markdownToTiptap", () => {
	it("converts headings, lists, quotes, code, and inline marks", () => {
		const document = markdownToTiptap(`Intro with **bold** and \`code\`.

## Heading

- first
- second

1. one
2. two

> A quote

\`\`\`ts
const value = 1;
\`\`\``);

		expect(document.content?.map((node) => node.type)).toEqual([
			"paragraph",
			"heading",
			"bulletList",
			"orderedList",
			"blockquote",
			"codeBlock",
		]);
		expect(document.content?.[0]?.content).toEqual([
			{ type: "text", text: "Intro with " },
			{ type: "text", text: "bold", marks: [{ type: "bold" }] },
			{ type: "text", text: " and " },
			{ type: "text", text: "code", marks: [{ type: "code" }] },
			{ type: "text", text: "." },
		]);
		expect(document.content?.[5]?.content?.[0]?.text).toBe("const value = 1;");
	});
});
