import { inArray, like } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
	bookmarks,
	categories,
	comments,
	follows,
	likes,
	notifications,
	postCategories,
	posts,
	postTags,
	postViews,
	tags,
	user,
} from "../schema/tables";
import {
	categoryDefinitions,
	SEED_EMAIL_DOMAIN,
	type SeedData,
	tagDefinitions,
} from "./seed.generator";

// biome-ignore lint/suspicious/noExplicitAny: works with any drizzle neon-http schema
type SeedDatabase = NeonHttpDatabase<any>;

const CHUNK_SIZE = 400;

const chunks = <T>(rows: T[]) =>
	Array.from({ length: Math.ceil(rows.length / CHUNK_SIZE) }, (_, index) =>
		rows.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE),
	);

const required = <K, V>(map: Map<K, V>, key: K, label: string): V => {
	const value = map.get(key);
	if (value === undefined)
		throw new Error(`Missing ${label} for ${String(key)}`);
	return value;
};

/**
 * Replaces every user under the seed e-mail domain (and, through cascading
 * foreign keys, their posts, comments, and reactions) with fresh demo data.
 * Rows that belong to real accounts are never touched.
 */
export const writeSeed = async (db: SeedDatabase, data: SeedData) => {
	// 1. Remove the previous seed and make sure taxonomy exists.
	const removed = await db
		.delete(user)
		.where(like(user.email, `%@${SEED_EMAIL_DOMAIN}`))
		.returning({ id: user.id });
	await db.batch([
		db.insert(categories).values(categoryDefinitions).onConflictDoNothing(),
		db.insert(tags).values(tagDefinitions).onConflictDoNothing(),
	]);
	const [categoryRows, tagRows] = await db.batch([
		db.select({ id: categories.id, slug: categories.slug }).from(categories),
		db.select({ id: tags.id, slug: tags.slug }).from(tags),
	]);
	const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));
	const tagIds = new Map(tagRows.map((row) => [row.slug, row.id]));

	// 2. Users and posts.
	await db.insert(user).values(data.users);
	const insertedPosts: { id: number; slug: string }[] = [];
	for (const rows of chunks(data.posts)) {
		insertedPosts.push(
			...(await db
				.insert(posts)
				.values(
					rows.map(
						({
							key: _key,
							language: _language,
							categorySlug: _category,
							tagSlugs: _tags,
							...post
						}) => post,
					),
				)
				.returning({ id: posts.id, slug: posts.slug })),
		);
	}
	const postIdBySlug = new Map(insertedPosts.map((row) => [row.slug, row.id]));
	const postIdByKey = new Map(
		data.posts.map((post) => [
			post.key,
			required(postIdBySlug, post.slug, "post"),
		]),
	);
	const postByKey = new Map(data.posts.map((post) => [post.key, post]));

	// 3. Taxonomy links, reactions, follows, and top-level comments.
	const rootComments = data.comments.filter((comment) => !comment.parentKey);
	const statements = [
		...chunks(
			data.posts.map((post) => ({
				postId: required(postIdByKey, post.key, "post"),
				categoryId: required(categoryIds, post.categorySlug, "category"),
			})),
		).map((rows) => db.insert(postCategories).values(rows)),
		...chunks(
			data.posts.flatMap((post) =>
				post.tagSlugs.map((slug) => ({
					postId: required(postIdByKey, post.key, "post"),
					tagId: required(tagIds, slug, "tag"),
				})),
			),
		).map((rows) => db.insert(postTags).values(rows)),
		...chunks(
			data.likes.map((item) => ({
				userId: item.userId,
				postId: required(postIdByKey, item.postKey, "post"),
				createdAt: item.createdAt,
			})),
		).map((rows) => db.insert(likes).values(rows)),
		...chunks(
			data.bookmarks.map((item) => ({
				userId: item.userId,
				postId: required(postIdByKey, item.postKey, "post"),
				createdAt: item.createdAt,
			})),
		).map((rows) => db.insert(bookmarks).values(rows)),
		...chunks(
			data.views.map((item) => ({
				userId: item.userId,
				postId: required(postIdByKey, item.postKey, "post"),
				viewedAt: item.viewedAt,
			})),
		).map((rows) => db.insert(postViews).values(rows)),
		...chunks(data.follows).map((rows) => db.insert(follows).values(rows)),
	];
	await db.batch(statements as [(typeof statements)[number]]);

	const commentIdByKey = new Map<string, number>();
	const insertComments = async (rows: typeof data.comments) => {
		for (const part of chunks(rows)) {
			const inserted = await db
				.insert(comments)
				.values(
					part.map((comment) => ({
						postId: required(postIdByKey, comment.postKey, "post"),
						userId: comment.userId,
						parentId: comment.parentKey
							? required(commentIdByKey, comment.parentKey, "parent comment")
							: null,
						content: comment.content,
						createdAt: comment.createdAt,
					})),
				)
				.returning({ id: comments.id });
			inserted.forEach((row, index) => {
				const key = part[index]?.key;
				if (key) commentIdByKey.set(key, row.id);
			});
		}
	};
	await insertComments(rootComments);
	await insertComments(data.comments.filter((comment) => comment.parentKey));

	// 4. Notifications for the activity above.
	const commentsByKey = new Map(
		data.comments.map((comment) => [comment.key, comment]),
	);
	const notificationRows = [
		...data.follows.map((item) => ({
			userId: item.followingId,
			actorId: item.followerId,
			type: "follow" as const,
			isRead: true,
			createdAt: item.createdAt,
		})),
		...data.likes
			.filter((_, index) => index % 3 === 0)
			.map((item) => ({
				userId: required(postByKey, item.postKey, "post").authorId,
				actorId: item.userId,
				postId: required(postIdByKey, item.postKey, "post"),
				type: "like" as const,
				isRead: true,
				createdAt: item.createdAt,
			})),
		...data.comments.map((comment) => {
			const parent = comment.parentKey
				? required(commentsByKey, comment.parentKey, "parent comment")
				: null;
			return {
				userId: parent
					? parent.userId
					: required(postByKey, comment.postKey, "post").authorId,
				actorId: comment.userId,
				postId: required(postIdByKey, comment.postKey, "post"),
				commentId: required(commentIdByKey, comment.key, "comment"),
				type: "comment" as const,
				isRead: true,
				createdAt: comment.createdAt,
			};
		}),
	];
	const notificationStatements = chunks(notificationRows).map((rows) =>
		db.insert(notifications).values(rows),
	);
	await db.batch(
		notificationStatements as [(typeof notificationStatements)[number]],
	);

	const [seedUsers] = await db.batch([
		db
			.select({ id: user.id })
			.from(user)
			.where(
				inArray(
					user.id,
					data.users.map((item) => item.id),
				),
			),
	]);
	return {
		removedUsers: removed.length,
		users: seedUsers.length,
		posts: insertedPosts.length,
		comments: commentIdByKey.size,
		notifications: notificationRows.length,
	};
};
