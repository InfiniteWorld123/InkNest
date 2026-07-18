import { db } from "#/backend/db";
import { sql } from "drizzle-orm";

export const listPostsService = async () => {
  const result = await db.execute(sql`
		
	`);

  return result.rows;
};

export const getPostBySlugService = async () => {
  const result = await db.execute(sql`
		
	`);

  return result.rows;
};

export const listCurrentUserPostsService = async () => {
  const result = await db.execute(sql`
		
	`);

  return result.rows;
};

export const createPostService = async () => {
  const result = await db.execute(sql`
		
	`);

  return result.rows;
};

export const updatePostService = async () => {
  const result = await db.execute(sql`
		
	`);

  return result.rows;
};

export const deletePostService = async () => {
  const result = await db.execute(sql`
		
	`);

  return result.rows;
};
