import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { SignUpSchema } from "./auth.validation";
import { PositiveIntegerPathParamSchema } from "./common.validation";
import { UpdatePostBodySchema } from "./post.validation";

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

	it("rejects empty post updates", () => {
		expect(v.safeParse(UpdatePostBodySchema, {}).success).toBe(false);
	});
});
