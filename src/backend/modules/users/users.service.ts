import { eq, sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { user } from "#/backend/db/schema/auth";
import { ensureUpdateBody, requireFound } from "#/backend/shared/service-utils";
import type { UpdateCurrentUserServiceType } from "#/shared/types/users.type";

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
}: UpdateCurrentUserServiceType) => {
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
