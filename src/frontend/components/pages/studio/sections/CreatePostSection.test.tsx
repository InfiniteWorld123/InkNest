// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mutationMocks = vi.hoisted(() => ({
	createPost: vi.fn(),
	updatePost: vi.fn(),
}));

vi.mock("#/frontend/api/queries/post.query", () => ({
	createPostMutation: () => ({
		isPending: false,
		mutateAsync: mutationMocks.createPost,
	}),
	updatePostMutation: () => ({
		isPending: false,
		mutateAsync: mutationMocks.updatePost,
	}),
}));

vi.mock("./ImageUploadField", () => ({
	ImageUploadField: () => <input aria-label="Choose a cover image" readOnly />,
}));

vi.mock("./RichTextEditor", () => ({
	RichTextEditor: ({
		value,
		onChange,
	}: {
		value: string;
		onChange: (value: string) => void;
	}) => {
		const [visibleValue, setVisibleValue] = useState(
			value.includes('"text"') ? value : "",
		);

		return (
			<textarea
				aria-label="Post content"
				value={visibleValue}
				onChange={(event) => {
					const nextValue = event.target.value;
					setVisibleValue(nextValue);
					onChange(
						JSON.stringify({
							type: "doc",
							content: [
								{
									type: "paragraph",
									content: [{ type: "text", text: nextValue }],
								},
							],
						}),
					);
				}}
			/>
		);
	},
}));

import { CreatePostSection } from "./CreatePostSection";

describe("CreatePostSection", () => {
	beforeEach(() => {
		mutationMocks.createPost.mockReset();
		mutationMocks.createPost.mockResolvedValue({ success: true });
		mutationMocks.updatePost.mockReset();
	});

	afterEach(cleanup);

	it("clears the rich-text editor after publishing", async () => {
		render(
			<CreatePostSection editingPost={null} onCancelEdit={vi.fn()} />,
		);

		const title = screen.getByPlaceholderText("A story worth sharing");
		const editor = screen.getByLabelText("Post content");

		fireEvent.change(title, { target: { value: "Editor reset test" } });
		fireEvent.change(editor, {
			target: { value: "This content should disappear after publishing." },
		});
		fireEvent.click(screen.getByRole("button", { name: "Publish post" }));

		await waitFor(() => {
			expect(mutationMocks.createPost).toHaveBeenCalledTimes(1);
		});
		await waitFor(() => {
			expect(
				(screen.getByLabelText("Post content") as HTMLTextAreaElement).value,
			).toBe("");
		});

		expect((title as HTMLInputElement).value).toBe("");
	});
});
