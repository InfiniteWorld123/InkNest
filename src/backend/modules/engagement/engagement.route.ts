import { Elysia } from "elysia";
import { authPlugin } from "#/backend/shared/authPlugin";
import {
  PostIdParamsSchema,
  UserIdParamsSchema,
  UsernameParamsSchema,
} from "#/shared/validation/engagement.validation";
import {
  bookmarkPost,
  countPostLikes,
  followUser,
  likePost,
  listCurrentUserBookmarks,
  listCurrentUserLikedPosts,
  listUserFollowers,
  listUserFollowing,
  listUsersWhoLikedPost,
  recordPostView,
  removePostBookmark,
  unfollowUser,
  unlikePost,
} from "./engagement.controller";

export const engagementRoutes = new Elysia()
  .use(authPlugin)
  .get("/posts/:postId/likes", listUsersWhoLikedPost, {
    params: PostIdParamsSchema,
  })
  .get("/posts/:postId/likes/count", countPostLikes, {
    params: PostIdParamsSchema,
  })
  .get("/users/:username/followers", listUserFollowers, {
    params: UsernameParamsSchema,
  })
  .get("/users/:username/following", listUserFollowing, {
    params: UsernameParamsSchema,
  })
  .post("/posts/:postId/views", recordPostView, {
    params: PostIdParamsSchema,
    optionalAuth: true,
  })
  .guard({ auth: true }, (app) =>
    app
      .get("/users/me/likes", listCurrentUserLikedPosts)
      .put("/posts/:postId/like", likePost, {
        params: PostIdParamsSchema,
      })
      .delete("/posts/:postId/like", unlikePost, {
        params: PostIdParamsSchema,
      })
      .get("/users/me/bookmarks", listCurrentUserBookmarks)
      .put("/posts/:postId/bookmark", bookmarkPost, {
        params: PostIdParamsSchema,
      })
      .delete("/posts/:postId/bookmark", removePostBookmark, {
        params: PostIdParamsSchema,
      })
      .put("/users/:userId/follow", followUser, {
        params: UserIdParamsSchema,
      })
      .delete("/users/:userId/follow", unfollowUser, {
        params: UserIdParamsSchema,
      }),
  );
