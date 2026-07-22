import { createFileRoute } from "@tanstack/react-router";
import { userByUsernameQueryOptions } from "#/frontend/api/queries/users.query";
import { UserProfilePage } from "#/frontend/components/pages/users/pages/UserProfilePage";

export const Route = createFileRoute("/_marketing/users_/$username")({
	ssr: true,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			userByUsernameQueryOptions(params.username),
		),
	component: UserProfilePage,
});
