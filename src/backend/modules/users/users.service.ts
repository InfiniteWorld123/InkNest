import { sql } from "drizzle-orm";
import { db } from "#/backend/db";
import { requireFound } from "#/backend/shared/service-utils";
import type {
  AuthenticatedUserType,
  GetUserByUsernameParamsType,
  UpdateCurrentUserBodyType,
} from "#/shared/types/users.type";

export const getCurrentUserService = async ({
  user,
}: {
  user: AuthenticatedUserType;
}) => {
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
		WHERE id = ${user.id}
	`);

  return requireFound(result.rows[0], "User not found");
};

export const updateCurrentUserService = async ({
  user,
  body,
}: {
  user: AuthenticatedUserType;
  body: UpdateCurrentUserBodyType;
}) => {
  user;
  body;
  // TODO: Implement service.
};

export const getUserByUsernameService = async ({
  params,
}: {
  params: GetUserByUsernameParamsType;
}) => {
  // TODO: Implement service.
};
