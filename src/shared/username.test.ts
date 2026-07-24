import { describe, expect, it } from "vitest";
import { createGeneratedUsername } from "./username";

describe("createGeneratedUsername", () => {
	it("creates a stable profile-safe username from the name and user ID", () => {
		expect(
			createGeneratedUsername(
				"Yaman Warda",
				"V7ER0kX5IDeZQNGYLBQYB6SQluhQOBMc",
			),
		).toBe("yaman.warda.v7er0kx5idez");
	});

	it("normalizes accents and stays within the username limit", () => {
		const username = createGeneratedUsername(
			"Éléonore A Very Long Family Name",
			"ABCDEF1234567890",
		);

		expect(username).toBe("eleonore.a.very.l.abcdef123456");
		expect(username.length).toBeLessThanOrEqual(30);
	});

	it("falls back when a name and ID contain no usable characters", () => {
		expect(createGeneratedUsername("東京", "---")).toBe("writer.member");
	});
});
