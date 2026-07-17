import type * as v from "valibot";
import type { NotificationIdParamsSchema } from "../validation/notifications.validation";

export type NotificationIdParamsType = v.InferOutput<
  typeof NotificationIdParamsSchema
>;
