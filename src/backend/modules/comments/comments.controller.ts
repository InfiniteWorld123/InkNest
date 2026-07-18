import { status } from "elysia";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
  CommentIdParams,
  CreateCommentBody,
  PostCommentsParams,
  UpdateCommentBody,
} from "#/shared/types/comments.type";
import type { AuthenticatedUser } from "#/shared/types/users.type";
import {
  createCommentService,
  deleteCommentService,
  listPostCommentsService,
  updateCommentService,
} from "./comments.service";

export const listPostComments = async ({
  params,
}: {
  params: PostCommentsParams;
}) => {
  const data = await listPostCommentsService({ params });

  return responseOk({ data, message: "Comments retrieved successfully" });
};

export const createComment = async ({
  user,
  params,
  body,
}: {
  user: AuthenticatedUser;
  params: PostCommentsParams;
  body: CreateCommentBody;
}) => {
  const data = await createCommentService({ userId: user.id, params, body });

  return status(
    HttpStatusCode.CREATED,
    responseOk({ data, message: "Comment created successfully" }),
  );
};

export const updateComment = async ({
  user,
  params,
  body,
}: {
  user: AuthenticatedUser;
  params: CommentIdParams;
  body: UpdateCommentBody;
}) => {
  const data = await updateCommentService({ userId: user.id, params, body });

  return responseOk({ data, message: "Comment updated successfully" });
};

export const deleteComment = async ({
  user,
  params,
}: {
  user: AuthenticatedUser;
  params: CommentIdParams;
}) => {
  const data = await deleteCommentService({ userId: user.id, params });

  return responseOk({ data, message: "Comment deleted successfully" });
};
