import * as v from "valibot";
import { UsernameSchema } from "./users.validation";

const PositiveIntegerParamsSchema = v.pipe(
  v.string(),
  v.regex(/^\d+$/, "ID must be a positive integer"),
  v.toNumber(),
  v.integer(),
  v.minValue(1, "ID must be a positive integer"),
);

export const PostIdParamsSchema = v.object({
  postId: PositiveIntegerParamsSchema,
});

export const UsernameParamsSchema = v.object({
  username: UsernameSchema,
});

export const UserIdParamsSchema = v.object({
  userId: v.pipe(v.string(), v.trim(), v.minLength(1, "User ID is required")),
});
