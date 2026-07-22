import { eq, sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { user } from "#/backend/db/schema/auth";
import { ensureUpdateBody, requireFound } from "#/backend/shared/service-utils";
import type {
	ListUsersQuery,
	UpdateCurrentUserBody,
} from "#/shared/types/users.type";

type UpdateCurrentUserInput = {
	userId: string;
	body: UpdateCurrentUserBody;
};

export const getCurrentUserService = async (userId: string) => {
	const result = await db.execute(sql`
		SELECT
			id,
			name,
			username,
			email,
			email_verified AS "emailVerified",
			image,
			bio,
			created_at AS "createdAt",
			updated_at AS "updatedAt"
		FROM "user"
		WHERE id = ${userId}
	`);

	return requireFound(result.rows[0], "User not found");
};

export const updateCurrentUserService = async ({
	userId,
	body,
}: UpdateCurrentUserInput) => {
	ensureUpdateBody(body);

	const result = await db
		.update(user)
		.set({
			...body,
			updatedAt: new Date(),
		})
		.where(eq(user.id, userId))
		.returning({
			id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			emailVerified: user.emailVerified,
			image: user.image,
			bio: user.bio,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		});

	return requireFound(result[0], "User not found");
};

export const getUserByUsernameService = async (username: string) => {
	const result = await db.execute(sql`
		SELECT
			id,
			name,
			username,
			image,
			bio,
			created_at AS "createdAt"
		FROM "user"
		WHERE username = ${username}
	`);

	return requireFound(result.rows[0], "User not found");
};

export const listUsersService = async ({ search }: ListUsersQuery) => {
	const searchTerm = search ? `%${search}%` : undefined;

	const result = await db.execute(sql`
		SELECT
			id,
			name,
			username,
			image,
			bio,
			created_at AS "createdAt"
		FROM "user"
		${searchTerm ? sql`WHERE name ILIKE ${searchTerm} OR username ILIKE ${searchTerm}` : sql``}
		ORDER BY created_at DESC, id
	`);

	return result.rows;
};
