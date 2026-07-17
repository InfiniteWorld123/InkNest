import * as v from "valibot";

const NotificationIdSchema = v.pipe(
  v.string(),
  v.regex(/^[1-9]\d*$/, "Notification ID must be a positive integer"),
  v.toNumber(),
  v.integer(),
  v.minValue(1, "Notification ID must be a positive integer"),
);

export const NotificationIdParamsSchema = v.object({
  id: NotificationIdSchema,
});
