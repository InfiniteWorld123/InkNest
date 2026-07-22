import { createFileRoute } from "@tanstack/react-router";
import { listUsersQueryOptions } from "#/frontend/api/queries/users.query";
import { UsersListPage } from "#/frontend/components/pages/users/pages/UsersListPage";
import { ListUsersQuerySchema } from "#/shared/validation/users.validation";

export const Route = createFileRoute("/_marketing/users")({
	component: UsersListPage,
	validateSearch: ListUsersQuerySchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => {
		void context.queryClient.prefetchQuery(listUsersQueryOptions(deps));
	},
});
