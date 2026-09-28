import { Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	listPostsService: vi.fn(),
	getPostBySlugService: vi.fn(),
	getSession: vi.fn(),
}));

vi.mock("#/backend/shared/auth", () => ({
	auth: { api: { getSession: mocks.getSession } },
}));

vi.mock("./posts.service", () => ({
	createPostService: vi.fn(),
	deletePostService: vi.fn(),
	getPostBySlugService: mocks.getPostBySlugService,
	listCurrentUserPostsService: vi.fn(),
	listPostsService: mocks.listPostsService,
	updatePostService: vi.fn(),
}));

import { postsRoutes } from "./posts.route";

// Cloudflare Workers forbid runtime code generation, so the API runs Elysia
// without AOT compilation (see `app.ts`). Validated params and query must
// still reach the handlers in that mode.
const testApp = new Elysia({ prefix: "/api", aot: false }).use(postsRoutes);

const request = (path: string) =>
	testApp.handle(new Request(`http://localhost${path}`));

describe("posts HTTP routes without AOT", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.listPostsService.mockResolvedValue({ items: [] });
		mocks.getPostBySlugService.mockResolvedValue({ slug: "hello-world" });
	});

	it("passes parsed query filters to the post list", async () => {
		const response = await request(
			"/api/posts?search=%20writing%20&sortBy=likes&page=2&limit=5",
		);

		expect(response.status).toBe(200);
		expect(mocks.listPostsService).toHaveBeenCalledWith({
			search: "writing",
			sortBy: "likes",
			page: 2,
			limit: 5,
		});
	});

	it("passes the slug to the post lookup", async () => {
		const response = await request("/api/posts/by-slug/hello-world");

		expect(response.status).toBe(200);
		expect(mocks.getPostBySlugService).toHaveBeenCalledWith({
			slug: "hello-world",
		});
	});
});
