import type * as v from "valibot";
import type {
  PostIdParamsSchema,
  UserIdParamsSchema,
  UsernameParamsSchema,
} from "../validation/engagement.validation";

export type PostIdParamsType = v.InferOutput<typeof PostIdParamsSchema>;
export type UsernameParamsType = v.InferOutput<typeof UsernameParamsSchema>;
export type UserIdParamsType = v.InferOutput<typeof UserIdParamsSchema>;

export type CurrentUserPostParamsServiceType = {
  userId: string;
  params: PostIdParamsType;
};

export type FollowUserServiceType = {
  followerId: string;
  params: UserIdParamsType;
};

export type RecordPostViewServiceType = {
  userId: string | null;
  params: PostIdParamsType;
};
