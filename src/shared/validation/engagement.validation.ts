import * as v from "valibot";
import { PositiveIntegerPathParamSchema } from "./common.validation";
import { UsernameSchema } from "./users.validation";

export const PostIdParamsSchema = v.object({
	postId: PositiveIntegerPathParamSchema,
});

export const UsernameParamsSchema = v.object({
	username: UsernameSchema,
});
