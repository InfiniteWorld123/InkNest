import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { badRequestError } from "#/backend/shared/error";
import { requireCreated } from "#/backend/shared/service-utils";
import type {
  CurrentUserPostParamsServiceType,
  FollowUserServiceType,
  PostIdParamsType,
  RecordPostViewServiceType,
  UsernameParamsType,
} from "#/shared/types/engagement.type";

export const listUsersWhoLikedPostService = async ({
  params,
}: {
  params: PostIdParamsType;
}) => {
  const result = await db.execute(sql`
		SELECT
			u.id,
			u.name,
			u.username,
			u.image,
			l.created_at AS "likedAt"
		FROM likes AS l
		INNER JOIN "user" AS u
			ON u.id = l.user_id
		WHERE l.post_id = ${params.postId}
		ORDER BY l.created_at DESC
	`);

  return result.rows;
};

export const listCurrentUserLikedPostsService = async (userId: string) => {
  const result = await db.execute(sql`
		SELECT
			p.id,
			p.author_id AS "authorId",
			p.title,
			p.slug,
			p.content,
			p.status,
			p.published_at AS "publishedAt",
			p.created_at AS "createdAt",
			p.updated_at AS "updatedAt",
			l.created_at AS "likedAt"
		FROM likes AS l
		INNER JOIN posts AS p
			ON p.id = l.post_id
		WHERE l.user_id = ${userId}
		ORDER BY l.created_at DESC
	`);

  return result.rows;
};

export const countPostLikesService = async ({
  params,
}: {
  params: PostIdParamsType;
}) => {
  const result = await db.execute(sql`
		SELECT COUNT(*)::integer AS count
		FROM likes
		WHERE post_id = ${params.postId}
	`);

  return result.rows[0];
};

export const likePostService = async ({
  userId,
  params,
}: CurrentUserPostParamsServiceType) => {
  const result = await db.execute(sql`
		INSERT INTO likes (
			user_id,
			post_id
		)
		VALUES (
			${userId},
			${params.postId}
		)
		ON CONFLICT (user_id, post_id)
		DO UPDATE SET
			user_id = EXCLUDED.user_id
		RETURNING
			user_id AS "userId",
			post_id AS "postId",
			created_at AS "createdAt"
	`);

  return requireCreated(result.rows[0], "Like could not be created");
};

export const unlikePostService = async ({
  userId,
  params,
}: CurrentUserPostParamsServiceType) => {
  const result = await db.execute(sql`
		DELETE FROM likes
		WHERE user_id = ${userId}
			AND post_id = ${params.postId}
		RETURNING
			user_id AS "userId",
			post_id AS "postId"
	`);

  return result.rows[0] ?? null;
};

export const listCurrentUserBookmarksService = async (userId: string) => {
  const result = await db.execute(sql`
		SELECT
			p.id,
			p.author_id AS "authorId",
			p.title,
			p.slug,
			p.content,
			p.status,
			p.published_at AS "publishedAt",
			p.created_at AS "createdAt",
			p.updated_at AS "updatedAt",
			b.created_at AS "bookmarkedAt"
		FROM bookmarks AS b
		INNER JOIN posts AS p
			ON p.id = b.post_id
		WHERE b.user_id = ${userId}
		ORDER BY b.created_at DESC
	`);

  return result.rows;
};

export const bookmarkPostService = async ({
  userId,
  params,
}: CurrentUserPostParamsServiceType) => {
  const result = await db.execute(sql`
		INSERT INTO bookmarks (
			user_id,
			post_id
		)
		VALUES (
			${userId},
			${params.postId}
		)
		ON CONFLICT (user_id, post_id)
		DO UPDATE SET
			user_id = EXCLUDED.user_id
		RETURNING
			user_id AS "userId",
			post_id AS "postId",
			created_at AS "createdAt"
	`);

  return requireCreated(result.rows[0], "Bookmark could not be created");
};

export const removePostBookmarkService = async ({
  userId,
  params,
}: CurrentUserPostParamsServiceType) => {
  const result = await db.execute(sql`
		  DELETE FROM bookmarks
		  WHERE user_id = ${userId}
			  AND post_id = ${params.postId}
		  RETURNING
			  user_id AS "userId",
			  post_id AS "postId"
	  `);

  return result.rows[0] ?? null;
};

export const listUserFollowersService = async ({
  params,
}: {
  params: UsernameParamsType;
}) => {
  const result = await db.execute(sql`
		SELECT
			follower.id,
			follower.name,
			follower.username,
			follower.image,
			f.created_at AS "followedAt"
		FROM follows AS f
		INNER JOIN "user" AS follower
			ON follower.id = f.follower_id
		INNER JOIN "user" AS profile
			ON profile.id = f.following_id
		WHERE profile.username = ${params.username}
		ORDER BY follower.name ASC
	`);

  return result.rows;
};

export const listUserFollowingService = async ({
  params,
}: {
  params: UsernameParamsType;
}) => {
  const result = await db.execute(sql`
		SELECT
			followed.id,
			followed.name,
			followed.username,
			followed.image,
			f.created_at AS "followedAt"
		FROM follows AS f
		INNER JOIN "user" AS followed
			ON followed.id = f.following_id
		INNER JOIN "user" AS profile
			ON profile.id = f.follower_id
		WHERE profile.username = ${params.username}
		ORDER BY followed.name ASC
	`);

  return result.rows;
};

export const followUserService = async ({
  followerId,
  params,
}: FollowUserServiceType) => {
  const followingId = params.userId;

  if (followerId === followingId) {
    throw badRequestError("You cannot follow yourself");
  }

  const result = await db.execute(sql`
		  INSERT INTO follows (
			  follower_id,
			  following_id
		  )
		  VALUES (
			  ${followerId},
			  ${followingId}
		  )
		  ON CONFLICT (follower_id, following_id)
		  DO UPDATE SET
			  follower_id = EXCLUDED.follower_id
		  RETURNING
			  follower_id AS "followerId",
			  following_id AS "followingId",
			  created_at AS "createdAt"
	  `);

  return requireCreated(result.rows[0], "Follow could not be created");
};

export const unfollowUserService = async ({
  followerId,
  params,
}: FollowUserServiceType) => {
  const result = await db.execute(sql`
		DELETE FROM follows
		WHERE
			follower_id = ${followerId}
			AND following_id = ${params.userId}
		RETURNING
			follower_id AS "followerId",
			following_id AS "followingId"
	`);

  return result.rows[0] ?? null;
};

export const recordPostViewService = async ({
  userId,
  params,
}: RecordPostViewServiceType) => {
  const result = await db.execute(sql`
		INSERT INTO post_views (
			user_id,
			post_id
		)
		VALUES (
			${userId},
			${params.postId}
		)
		RETURNING
			id,
			user_id AS "userId",
			post_id AS "postId",
			viewed_at AS "viewedAt"
	`);

  return requireCreated(result.rows[0], "Post view could not be recorded");
};
