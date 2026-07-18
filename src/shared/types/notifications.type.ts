import type * as v from "valibot";
import type { NotificationIdParamsSchema } from "../validation/notifications.validation";

export type NotificationIdParams = v.InferOutput<
	typeof NotificationIdParamsSchema
>;
