import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { userByUsernameQueryOptions } from "#/frontend/api/queries/users.query";
import { UserProfileAbout } from "../sections/UserProfileAbout";
import { UserProfileExplore } from "../sections/UserProfileExplore";
import { UserProfileHero } from "../sections/UserProfileHero";

const userDetailRoute = getRouteApi("/_marketing/users_/$username");

export function UserProfilePage() {
	const { username } = userDetailRoute.useParams();
	const { data: response } = useSuspenseQuery(
		userByUsernameQueryOptions(username),
	);
	const user = response.data;

	return (
		<div className="overflow-hidden">
			<UserProfileHero user={user} />
			<div className="mx-auto max-w-3xl px-5 py-14 sm:py-18">
				<UserProfileAbout user={user} />
				<UserProfileExplore />
			</div>
		</div>
	);
}
