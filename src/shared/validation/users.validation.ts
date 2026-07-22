import * as v from "valibot";

export const AuthenticatedUserSchema = v.looseObject({
	id: v.pipe(v.string(), v.minLength(1, "Authenticated user ID is required")),
});

export const UsernameSchema = v.pipe(
	v.string(),
	v.trim(),
	v.toLowerCase(),
	v.minLength(3, "Username must be at least 3 characters long"),
	v.maxLength(30, "Username must be 30 characters or fewer"),
	v.regex(
		/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])$/,
		"Username may contain lowercase letters, numbers, periods, underscores, and hyphens",
	),
);

export const UpdateCurrentUserBodySchema = v.pipe(
	v.object({
		name: v.optional(
			v.pipe(
				v.string(),
				v.trim(),
				v.minLength(3, "Name must be at least 3 characters long"),
				v.maxLength(100, "Name must be 100 characters or fewer"),
			),
		),
		username: v.optional(UsernameSchema),
		bio: v.optional(
			v.nullable(
				v.pipe(v.string(), v.trim(), v.maxLength(500, "Bio is too long")),
			),
		),
		image: v.optional(
			v.nullable(
				v.pipe(v.string(), v.trim(), v.url("Image must be a valid URL")),
			),
		),
	}),
	v.check(
		(body) => Object.values(body).some((value) => value !== undefined),
		"At least one field is required",
	),
);

export const GetUserByUsernameParamsSchema = v.object({
	username: UsernameSchema,
});

export const ListUsersQuerySchema = v.object({
	search: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, "Search cannot be empty"),
			v.maxLength(100, "Search must be 100 characters or fewer"),
		),
	),
});
