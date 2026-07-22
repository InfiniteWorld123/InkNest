import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { badRequestError } from "#/backend/shared/error";
import { requireFound } from "#/backend/shared/service-utils";
import type {
	PostIdParams,
	UsernameParams,
} from "#/shared/types/engagement.type";

type CurrentUserPostInput = {
	userId: string;
	params: PostIdParams;
};
type FollowUserInput = {
	followerId: string;
	params: UsernameParams;
};
type RecordPostViewInput = {
	userId: string | null;
	params: PostIdParams;
};
type PostViewerEngagementInput = {
	userId: string | null;
	params: PostIdParams;
};

export const listUsersWhoLikedPostService = async ({
	params,
}: {
	params: PostIdParams;
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
		INNER JOIN posts AS p
			ON p.id = l.post_id
		WHERE l.post_id = ${params.postId}
			AND p.status = 'published'
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
			AND p.status = 'published'
		ORDER BY l.created_at DESC
	`);

	return result.rows;
};

export const countPostLikesService = async ({
	params,
}: {
	params: PostIdParams;
}) => {
	const result = await db.execute(sql`
		SELECT COUNT(*)::integer AS count
		FROM likes AS l
		INNER JOIN posts AS p
			ON p.id = l.post_id
		WHERE l.post_id = ${params.postId}
			AND p.status = 'published'
	`);

	return result.rows[0];
};

export const getPostViewerEngagementService = async ({
	userId,
	params,
}: PostViewerEngagementInput) => {
	const result = await db.execute(sql`
		SELECT
			CASE
				WHEN ${userId}::text IS NULL THEN FALSE
				ELSE EXISTS (
					SELECT 1
					FROM likes
					WHERE likes.user_id = ${userId}
						AND likes.post_id = post.id
				)
			END AS liked,
			CASE
				WHEN ${userId}::text IS NULL THEN FALSE
				ELSE EXISTS (
					SELECT 1
					FROM bookmarks
					WHERE bookmarks.user_id = ${userId}
						AND bookmarks.post_id = post.id
				)
			END AS bookmarked
		FROM posts AS post
		WHERE post.id = ${params.postId}
			AND post.status = 'published'
	`);

	return requireFound(result.rows[0], "Post not found");
};

export const likePostService = async ({
	userId,
	params,
}: CurrentUserPostInput) => {
	const result = await db.execute(sql`
		INSERT INTO likes (
			user_id,
			post_id
		)
		SELECT ${userId}, p.id
		FROM posts AS p
		WHERE p.id = ${params.postId}
			AND p.status = 'published'
		ON CONFLICT (user_id, post_id)
		DO UPDATE SET
			user_id = EXCLUDED.user_id
		RETURNING
			user_id AS "userId",
			post_id AS "postId",
			created_at AS "createdAt"
	`);

	return requireFound(result.rows[0], "Post not found");
};

export const unlikePostService = async ({
	userId,
	params,
}: CurrentUserPostInput) => {
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
			AND p.status = 'published'
		ORDER BY b.created_at DESC
	`);

	return result.rows;
};

export const bookmarkPostService = async ({
	userId,
	params,
}: CurrentUserPostInput) => {
	const result = await db.execute(sql`
		INSERT INTO bookmarks (
			user_id,
			post_id
		)
		SELECT ${userId}, p.id
		FROM posts AS p
		WHERE p.id = ${params.postId}
			AND p.status = 'published'
		ON CONFLICT (user_id, post_id)
		DO UPDATE SET
			user_id = EXCLUDED.user_id
		RETURNING
			user_id AS "userId",
			post_id AS "postId",
			created_at AS "createdAt"
	`);

	return requireFound(result.rows[0], "Post not found");
};

export const removePostBookmarkService = async ({
	userId,
	params,
}: CurrentUserPostInput) => {
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
	params: UsernameParams;
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
	params: UsernameParams;
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
}: FollowUserInput) => {
	const targetResult = await db.execute(sql`
		SELECT id
		FROM "user"
		WHERE username = ${params.username}
	`);
	const target = requireFound(targetResult.rows[0], "User not found") as {
		id: string;
	};
	const followingId = target.id;

	if (followerId === followingId) {
		throw badRequestError("You cannot follow yourself");
	}

	const result = await db.execute(sql`
		  INSERT INTO follows (
			  follower_id,
			  following_id
		  )
		SELECT ${followerId}, target.id
		FROM "user" AS target
		WHERE target.id = ${followingId}
		  ON CONFLICT (follower_id, following_id)
		  DO UPDATE SET
			  follower_id = EXCLUDED.follower_id
		  RETURNING
			  follower_id AS "followerId",
			  following_id AS "followingId",
			  created_at AS "createdAt"
	  `);

	return requireFound(result.rows[0], "User not found");
};

export const unfollowUserService = async ({
	followerId,
	params,
}: FollowUserInput) => {
	const targetResult = await db.execute(sql`
		SELECT id
		FROM "user"
		WHERE username = ${params.username}
	`);
	const target = requireFound(targetResult.rows[0], "User not found") as {
		id: string;
	};

	const result = await db.execute(sql`
		DELETE FROM follows
		WHERE
			follower_id = ${followerId}
			AND following_id = ${target.id}
		RETURNING
			follower_id AS "followerId",
			following_id AS "followingId"
	`);

	return result.rows[0] ?? null;
};

export const recordPostViewService = async ({
	userId,
	params,
}: RecordPostViewInput) => {
	const result = await db.execute(sql`
		INSERT INTO post_views (
			user_id,
			post_id
		)
		SELECT ${userId}, p.id
		FROM posts AS p
		WHERE p.id = ${params.postId}
			AND p.status = 'published'
		RETURNING
			id,
			user_id AS "userId",
			post_id AS "postId",
			viewed_at AS "viewedAt"
	`);

	return requireFound(result.rows[0], "Post not found");
};
