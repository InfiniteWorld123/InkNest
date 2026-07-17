import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { comments } from "./comments";
import { posts } from "./posts";

export const notificationType = pgEnum("notification_type", [
  "like",
  "comment",
  "follow",
  "bookmark",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    actorId: text("actor_id").references(() => user.id, {
      onDelete: "set null",
    }),
    postId: integer("post_id").references(() => posts.id, {
      onDelete: "set null",
    }),
    commentId: integer("comment_id").references(() => comments.id, {
      onDelete: "set null",
    }),
    type: notificationType("type").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_user_read_created_idx").on(
      table.userId,
      table.isRead,
      table.createdAt,
    ),
  ],
);
