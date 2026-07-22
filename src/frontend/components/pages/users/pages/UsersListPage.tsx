import { CommunityHero } from "../sections/CommunityHero";
import { CommunityUsersBoundary } from "../sections/CommunityUsersBoundary";

export function UsersListPage() {
	return (
		<div className="overflow-hidden">
			<CommunityHero />
			<CommunityUsersBoundary />
		</div>
	);
}
