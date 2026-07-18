import type * as v from "valibot";
import type {
	AuthenticatedUserSchema,
	GetUserByUsernameParamsSchema,
	UpdateCurrentUserBodySchema,
} from "../validation/users.validation";

export type AuthenticatedUser = v.InferOutput<typeof AuthenticatedUserSchema>;

export type UpdateCurrentUserBody = v.InferOutput<
	typeof UpdateCurrentUserBodySchema
>;

export type GetUserByUsernameParams = v.InferOutput<
	typeof GetUserByUsernameParamsSchema
>;
