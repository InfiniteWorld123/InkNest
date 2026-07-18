import type {
	CommentIdParamsType,
	CreateCommentBodyType,
	PostCommentsParamsType,
	UpdateCommentBodyType,
} from "#/shared/types/comments.type";
import type { AuthenticatedUserType } from "#/shared/types/users.type";
import {
	createCommentService,
	deleteCommentService,
	listPostCommentsService,
	updateCommentService,
} from "./comments.service";

export const listPostComments = async ({
	params,
}: {
	params: PostCommentsParamsType;
}) => {
	return listPostCommentsService({ params });
};

export const createComment = async ({
	user,
	params,
	body,
}: {
	user: AuthenticatedUserType;
	params: PostCommentsParamsType;
	body: CreateCommentBodyType;
}) => {
	return createCommentService({ userId: user.id, params, body });
};

export const updateComment = async ({
	user,
	params,
	body,
}: {
	user: AuthenticatedUserType;
	params: CommentIdParamsType;
	body: UpdateCommentBodyType;
}) => {
	return updateCommentService({ userId: user.id, params, body });
};

export const deleteComment = async ({
	user,
	params,
}: {
	user: AuthenticatedUserType;
	params: CommentIdParamsType;
}) => {
	return deleteCommentService({ userId: user.id, params });
};
