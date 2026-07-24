import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { SignUpSchema } from "./auth.validation";
import { ListPostCommentsQuerySchema } from "./comments.validation";
import {
	PositiveIntegerPathParamSchema,
	PositiveIntegerQueryStringSchema,
} from "./common.validation";
import { CreatePostBodySchema, UpdatePostBodySchema } from "./post.validation";
import { UsernameSchema } from "./users.validation";

describe("shared validation", () => {
	it("normalizes valid sign-up input", () => {
		const result = v.parse(SignUpSchema, {
			name: "  Ada Lovelace  ",
			email: "  ADA@EXAMPLE.COM  ",
			password: "StrongPassword1!",
			confirmPassword: "StrongPassword1!",
		});

		expect(result.name).toBe("Ada Lovelace");
		expect(result.email).toBe("ada@example.com");
	});

	it("requires sign-up password confirmation", () => {
		const result = v.safeParse(SignUpSchema, {
			name: "Ada Lovelace",
			email: "ada@example.com",
			password: "StrongPassword1!",
		});

		expect(result.success).toBe(false);
	});

	it("parses positive integer path parameters", () => {
		expect(v.parse(PositiveIntegerPathParamSchema, "42")).toBe(42);
		expect(v.safeParse(PositiveIntegerPathParamSchema, "0").success).toBe(
			false,
		);
	});

	it("parses positive integer query values from URLs and the router", () => {
		expect(v.parse(PositiveIntegerQueryStringSchema, "2")).toBe(2);
		expect(v.parse(PositiveIntegerQueryStringSchema, 2)).toBe(2);
		expect(v.safeParse(PositiveIntegerQueryStringSchema, 0).success).toBe(
			false,
		);
	});

	it("parses bounded comment pagination", () => {
		expect(
			v.parse(ListPostCommentsQuerySchema, { cursor: "42", limit: "20" }),
		).toEqual({ cursor: 42, limit: 20 });
		expect(
			v.safeParse(ListPostCommentsQuerySchema, { limit: "51" }).success,
		).toBe(false);
	});

	it("rejects empty post updates", () => {
		expect(v.safeParse(UpdatePostBodySchema, {}).success).toBe(false);
	});

	it("rejects a post with an empty rich-text document", () => {
		expect(
			v.safeParse(CreatePostBodySchema, {
				title: "An empty post",
				slug: "an-empty-post",
				content: JSON.stringify({
					type: "doc",
					content: [{ type: "paragraph" }],
				}),
			}).success,
		).toBe(false);
	});

	it("accepts a valid post image URL", () => {
		const result = v.parse(CreatePostBodySchema, {
			title: "A post with an image",
			slug: "a-post-with-an-image",
			image: "https://images.example.com/post.jpg",
			content: "Post content",
		});

		expect(result.image).toBe("https://images.example.com/post.jpg");
	});

	it("rejects an invalid post image URL", () => {
		expect(
			v.safeParse(CreatePostBodySchema, {
				title: "A post with a bad image",
				slug: "a-post-with-a-bad-image",
				image: "not-a-url",
				content: "Post content",
			}).success,
		).toBe(false);
	});

	it("accepts the dotted username format used by public profiles", () => {
		expect(v.parse(UsernameSchema, "Amara.Okafor")).toBe("amara.okafor");
	});
});
