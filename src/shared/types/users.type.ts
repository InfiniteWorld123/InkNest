import type * as v from "valibot";
import type {
	AuthenticatedUserSchema,
	GetUserByUsernameParamsSchema,
	UpdateCurrentUserBodySchema,
} from "../validation/users.validation";

export type AuthenticatedUserType = v.InferOutput<
	typeof AuthenticatedUserSchema
>;

export type UpdateCurrentUserBodyType = v.InferOutput<
	typeof UpdateCurrentUserBodySchema
>;

export type UpdateCurrentUserServiceType = {
	userId: string;
	body: UpdateCurrentUserBodyType;
};

export type GetUserByUsernameParamsType = v.InferOutput<
	typeof GetUserByUsernameParamsSchema
>;
