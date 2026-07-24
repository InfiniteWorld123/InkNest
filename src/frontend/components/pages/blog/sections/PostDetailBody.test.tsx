// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostDetailBody } from "./PostDetailBody";

describe("PostDetailBody", () => {
	it("renders structured Tiptap content without injecting arbitrary HTML", () => {
		const content = JSON.stringify({
			type: "doc",
			content: [
				{
					type: "heading",
					attrs: { level: 2 },
					content: [{ type: "text", text: "A structured story" }],
				},
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							text: "Bold thought",
							marks: [{ type: "bold" }],
						},
					],
				},
			],
		});

		const { container } = render(<PostDetailBody content={content} />);

		expect(
			screen.getByRole("heading", { name: "A structured story", level: 2 }),
		).toBeTruthy();
		expect(screen.getByText("Bold thought").closest("strong")).toBeTruthy();
		expect(container.querySelector("script")).toBeNull();
	});

	it("keeps rendering legacy plain-text posts", () => {
		render(
			<PostDetailBody content={"First paragraph.\n\nSecond paragraph."} />,
		);

		expect(screen.getByText("First paragraph.")).toBeTruthy();
		expect(screen.getByText("Second paragraph.")).toBeTruthy();
	});
});
