import { describe, expect, it } from "vitest";
import { parseTiptapContent } from "#/shared/post-content";
import {
	buildSeedData,
	SEED_EMAIL_DOMAIN,
	seedSummary,
} from "./seed.generator";

const now = new Date("2026-09-28T12:00:00.000Z");

describe("InkNest seed generator", () => {
	it("creates 15 authors and 120 German and English posts", () => {
		const summary = seedSummary(buildSeedData(now));
		expect(summary.authors).toBe(15);
		expect(summary.posts).toBe(120);
		expect(summary.germanPosts).toBe(60);
		expect(summary.englishPosts).toBe(60);
	});

	it("stores valid TipTap content and shared cover images", () => {
		const data = buildSeedData(now);
		const covers = new Set(data.posts.map((post) => post.image));
		expect(covers.size).toBeLessThanOrEqual(12);
		for (const post of data.posts) {
			expect(parseTiptapContent(post.content)).not.toBeNull();
			expect(post.image).toMatch(/\/images\/covers\/[a-z]+\.webp$/);
		}
	});

	it("keeps seed users on the seed domain and slugs unique", () => {
		const data = buildSeedData(now);
		for (const user of data.users) {
			expect(user.email.endsWith(`@${SEED_EMAIL_DOMAIN}`)).toBe(true);
		}
		const slugs = data.posts.map((post) => post.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("keeps reactions unique per user and post", () => {
		const data = buildSeedData(now);
		for (const list of [data.likes, data.bookmarks]) {
			const keys = list.map((item) => `${item.userId}:${item.postKey}`);
			expect(new Set(keys).size).toBe(keys.length);
		}
		const follows = data.follows.map(
			(item) => `${item.followerId}:${item.followingId}`,
		);
		expect(new Set(follows).size).toBe(follows.length);
	});
});
