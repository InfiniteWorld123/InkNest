import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { postBySlugQueryOptions } from "#/frontend/api/queries/post.query";
import { PostCommentsSection } from "../sections/PostCommentsSection";
import { PostDetailAuthor } from "../sections/PostDetailAuthor";
import { PostDetailBody } from "../sections/PostDetailBody";
import { PostDetailHero } from "../sections/PostDetailHero";
import { PostEngagementActions } from "../sections/PostEngagementActions";

const postDetailRoute = getRouteApi("/_marketing/blog_/$slug");

export function PostDetailPage() {
	const { slug } = postDetailRoute.useParams();
	const { data: response } = useSuspenseQuery(postBySlugQueryOptions(slug));
	const post = response.data;

	return (
		<article>
			<PostDetailHero post={post} />
			<PostEngagementActions post={post} />
			<PostDetailBody content={post.content} />
			<PostDetailAuthor post={post} />
			<PostCommentsSection postId={post.id} />
		</article>
	);
}
