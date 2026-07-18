import type * as v from "valibot";
import type {
	PostIdParamsSchema,
	UsernameParamsSchema,
} from "../validation/engagement.validation";

export type PostIdParams = v.InferOutput<typeof PostIdParamsSchema>;
export type UsernameParams = v.InferOutput<typeof UsernameParamsSchema>;
