import { Label, SearchField } from "@heroui/react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createBlogSearchParams } from "../blogSearch";
import { usePrefetchBlogPosts } from "../hooks/usePrefetchBlogPosts";

const blogRoute = getRouteApi("/_marketing/blog");

export function BlogSearchFilter() {
	const navigate = useNavigate();
	const prefetchPosts = usePrefetchBlogPosts();
	const search = blogRoute.useSearch();
	const [query, setQuery] = useState(search.search ?? "");

	useEffect(() => {
		setQuery(search.search ?? "");
	}, [search.search]);

	useEffect(() => {
		const nextSearch = query.trim();

		if (nextSearch === (search.search ?? "")) return;

		const timeout = window.setTimeout(() => {
			void prefetchPosts({
				search: nextSearch || undefined,
				page: undefined,
			});
			void navigate({
				to: "/blog",
				replace: true,
				search: createBlogSearchParams(search, {
					search: nextSearch || undefined,
					page: undefined,
				}),
			});
		}, 400);

		return () => window.clearTimeout(timeout);
	}, [navigate, prefetchPosts, query, search]);

	return (
		<SearchField
			name="search"
			value={query}
			onChange={setQuery}
			className="lg:col-span-5"
			fullWidth
		>
			<Label>Search</Label>
			<SearchField.Group>
				<SearchField.SearchIcon />
				<SearchField.Input placeholder="Title, content, or author" />
				<SearchField.ClearButton />
			</SearchField.Group>
		</SearchField>
	);
}
