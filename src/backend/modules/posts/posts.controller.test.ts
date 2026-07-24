import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
	createPostService: vi.fn(),
	deletePostService: vi.fn(),
	getPostBySlugService: vi.fn(),
	listCurrentUserPostsService: vi.fn(),
	listPostsService: vi.fn(),
	updatePostService: vi.fn(),
}));

vi.mock("./posts.service", () => serviceMocks);

import {
	createPost,
	deletePost,
	listCurrentUserPosts,
	updatePost,
} from "./posts.controller";

const user = {
	id: "writer-1",
	name: "Ada Writer",
	email: "ada@example.com",
	emailVerified: true,
	image: null,
	username: "ada.writer",
	bio: null,
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("posts controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists only the signed-in writer's posts", async () => {
		serviceMocks.listCurrentUserPostsService.mockResolvedValue([]);

		const response = await listCurrentUserPosts({ user });

		expect(serviceMocks.listCurrentUserPostsService).toHaveBeenCalledWith(
			user.id,
		);
		expect(response.data).toEqual([]);
	});

	it("creates a post for the signed-in writer", async () => {
		const body = {
			title: "A new story",
			slug: "a-new-story",
			content: "Story content",
			status: "draft" as const,
		};
		serviceMocks.createPostService.mockResolvedValue({ id: 1, ...body });

		await createPost({ user, body });

		expect(serviceMocks.createPostService).toHaveBeenCalledWith({
			authorId: user.id,
			body,
		});
	});

	it("scopes updates to the signed-in writer", async () => {
		const body = { status: "published" as const };
		serviceMocks.updatePostService.mockResolvedValue({ id: 9, ...body });

		await updatePost({ user, params: { postId: 9 }, body });

		expect(serviceMocks.updatePostService).toHaveBeenCalledWith({
			authorId: user.id,
			params: { postId: 9 },
			body,
		});
	});

	it("scopes deletion to the signed-in writer", async () => {
		serviceMocks.deletePostService.mockResolvedValue({
			id: 9,
			slug: "a-new-story",
		});

		await deletePost({ user, params: { postId: 9 } });

		expect(serviceMocks.deletePostService).toHaveBeenCalledWith({
			authorId: user.id,
			params: { postId: 9 },
		});
	});
});
