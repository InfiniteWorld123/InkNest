import { defineRelations } from "drizzle-orm";
import {
	account,
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
	session,
	tags,
	user,
} from "./tables";

export const relations = defineRelations(
	{
		user,
		session,
		account,
		posts,
		comments,
		tags,
		categories,
		postTags,
		postCategories,
		likes,
		bookmarks,
		follows,
		postViews,
		notifications,
	},
	(r) => ({
		user: {
			sessions: r.many.session(),
			accounts: r.many.account(),
			posts: r.many.posts(),
			comments: r.many.comments(),
			likes: r.many.likes(),
			bookmarks: r.many.bookmarks(),
			views: r.many.postViews(),
			following: r.many.follows({
				from: r.user.id,
				to: r.follows.followerId,
				alias: "follower",
			}),
			followers: r.many.follows({
				from: r.user.id,
				to: r.follows.followingId,
				alias: "following",
			}),
			notifications: r.many.notifications({
				from: r.user.id,
				to: r.notifications.userId,
				alias: "recipient",
			}),
			performedNotifications: r.many.notifications({
				from: r.user.id,
				to: r.notifications.actorId,
				alias: "actor",
			}),
		},
		session: {
			user: r.one.user({ from: r.session.userId, to: r.user.id }),
		},
		account: {
			user: r.one.user({ from: r.account.userId, to: r.user.id }),
		},
		posts: {
			author: r.one.user({ from: r.posts.authorId, to: r.user.id }),
			comments: r.many.comments(),
			tags: r.many.postTags(),
			categories: r.many.postCategories(),
			likes: r.many.likes(),
			bookmarks: r.many.bookmarks(),
			views: r.many.postViews(),
			notifications: r.many.notifications(),
		},
		comments: {
			post: r.one.posts({ from: r.comments.postId, to: r.posts.id }),
			author: r.one.user({ from: r.comments.userId, to: r.user.id }),
			parent: r.one.comments({
				from: r.comments.parentId,
				to: r.comments.id,
				alias: "parent",
			}),
			replies: r.many.comments({
				from: r.comments.id,
				to: r.comments.parentId,
				alias: "parent",
			}),
			notifications: r.many.notifications(),
		},
		tags: {
			posts: r.many.postTags(),
		},
		categories: {
			posts: r.many.postCategories(),
		},
		postTags: {
			post: r.one.posts({ from: r.postTags.postId, to: r.posts.id }),
			tag: r.one.tags({ from: r.postTags.tagId, to: r.tags.id }),
		},
		postCategories: {
			post: r.one.posts({ from: r.postCategories.postId, to: r.posts.id }),
			category: r.one.categories({
				from: r.postCategories.categoryId,
				to: r.categories.id,
			}),
		},
		likes: {
			user: r.one.user({ from: r.likes.userId, to: r.user.id }),
			post: r.one.posts({ from: r.likes.postId, to: r.posts.id }),
		},
		bookmarks: {
			user: r.one.user({ from: r.bookmarks.userId, to: r.user.id }),
			post: r.one.posts({ from: r.bookmarks.postId, to: r.posts.id }),
		},
		follows: {
			follower: r.one.user({
				from: r.follows.followerId,
				to: r.user.id,
				alias: "follower",
			}),
			following: r.one.user({
				from: r.follows.followingId,
				to: r.user.id,
				alias: "following",
			}),
		},
		postViews: {
			post: r.one.posts({ from: r.postViews.postId, to: r.posts.id }),
			user: r.one.user({ from: r.postViews.userId, to: r.user.id }),
		},
		notifications: {
			recipient: r.one.user({
				from: r.notifications.userId,
				to: r.user.id,
				alias: "recipient",
			}),
			actor: r.one.user({
				from: r.notifications.actorId,
				to: r.user.id,
				alias: "actor",
			}),
			post: r.one.posts({ from: r.notifications.postId, to: r.posts.id }),
			comment: r.one.comments({
				from: r.notifications.commentId,
				to: r.comments.id,
			}),
		},
	}),
);
