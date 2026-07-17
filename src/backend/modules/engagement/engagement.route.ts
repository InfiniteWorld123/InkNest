import { Elysia } from "elysia";
import {
	bookmarkPost,
	followUser,
	likePost,
	listCurrentUserBookmarks,
	listPostLikes,
	listUserFollowers,
	listUserFollowing,
	recordPostView,
	removePostBookmark,
	unfollowUser,
	unlikePost,
} from "./engagement.controller";

export const engagementRoutes = new Elysia()
	.get("/posts/:postId/likes", listPostLikes)
	.put("/posts/:postId/like", likePost)
	.delete("/posts/:postId/like", unlikePost)
	.get("/users/me/bookmarks", listCurrentUserBookmarks)
	.put("/posts/:postId/bookmark", bookmarkPost)
	.delete("/posts/:postId/bookmark", removePostBookmark)
	.get("/users/:username/followers", listUserFollowers)
	.get("/users/:username/following", listUserFollowing)
	.put("/users/:userId/follow", followUser)
	.delete("/users/:userId/follow", unfollowUser)
	.post("/posts/:postId/views", recordPostView);
