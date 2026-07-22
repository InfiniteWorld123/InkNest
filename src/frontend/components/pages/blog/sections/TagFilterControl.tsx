import { Alert, Button, Skeleton } from "@heroui/react";
import {
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	CatchBoundary,
	getRouteApi,
	useNavigate,
} from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { listTagsQueryOptions } from "#/frontend/api/queries/taxonomy.query";
import { createBlogSearchParams } from "../blogSearch";
import { usePrefetchBlogPosts } from "../hooks/usePrefetchBlogPosts";

const blogRoute = getRouteApi("/_marketing/blog");
const COLLAPSED_TAG_COUNT = 12;
const MAX_SELECTED_TAGS = 20;

export function TagFilterControl() {
	return (
		<fieldset className="flex min-w-0 flex-col gap-1.5 border-0 p-0">
			<legend className="text-sm font-medium text-slate-700 dark:text-slate-300">
				Tags
			</legend>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<CatchBoundary
						getResetKey={() => "blog-tags"}
						onCatch={reset}
						errorComponent={({ reset: resetBoundary }) => (
							<TagFilterError
								onRetry={() => {
									reset();
									resetBoundary();
								}}
							/>
						)}
					>
						<Suspense fallback={<TagFilterPending />}>
							<TagFilterContent />
						</Suspense>
					</CatchBoundary>
				)}
			</QueryErrorResetBoundary>
		</fieldset>
	);
}

function TagFilterContent() {
	const { data } = useSuspenseQuery(listTagsQueryOptions());
	const navigate = useNavigate();
	const prefetchPosts = usePrefetchBlogPosts();
	const search = blogRoute.useSearch();
	const [isExpanded, setIsExpanded] = useState(false);
	const selectedTags = search.tags ?? [];
	const collapsedTags = data.data.slice(0, COLLAPSED_TAG_COUNT);
	const selectedTagsOutsideCollapsedList = data.data.filter(
		(tag) =>
			selectedTags.includes(tag.slug) &&
			!collapsedTags.some((visibleTag) => visibleTag.slug === tag.slug),
	);
	const visibleTags = isExpanded
		? data.data
		: [...collapsedTags, ...selectedTagsOutsideCollapsedList];

	const getNextTags = (slug: string) =>
		selectedTags.includes(slug)
			? selectedTags.filter((tag) => tag !== slug)
			: [...selectedTags, slug];

	const prefetchTagSelection = (slug: string) => {
		if (
			selectedTags.length >= MAX_SELECTED_TAGS &&
			!selectedTags.includes(slug)
		) {
			return;
		}

		const nextTags = getNextTags(slug);
		void prefetchPosts({
			tags: nextTags.length > 0 ? nextTags : undefined,
			page: undefined,
		});
	};

	const toggleTag = (slug: string) => {
		if (
			selectedTags.length >= MAX_SELECTED_TAGS &&
			!selectedTags.includes(slug)
		) {
			return;
		}

		const nextTags = getNextTags(slug);
		const tags = nextTags.length > 0 ? nextTags : undefined;

		void prefetchPosts({ tags, page: undefined });
		void navigate({
			to: "/blog",
			replace: true,
			search: createBlogSearchParams(search, {
				tags,
				page: undefined,
			}),
		});
	};

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{visibleTags.map((tag) => {
					const isSelected = selectedTags.includes(tag.slug);
					const isDisabled =
						!isSelected && selectedTags.length >= MAX_SELECTED_TAGS;

					return (
						<button
							type="button"
							key={tag.slug}
							aria-pressed={isSelected}
							disabled={isDisabled}
							onMouseEnter={() => prefetchTagSelection(tag.slug)}
							onFocus={() => prefetchTagSelection(tag.slug)}
							onClick={() => toggleTag(tag.slug)}
							className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-950 ${
								isSelected
									? "border-accent-600 bg-accent-600 text-white shadow-sm dark:border-accent-400 dark:bg-accent-500 dark:text-slate-950"
									: "border-slate-300 bg-white text-slate-700 hover:border-accent-400 hover:text-accent-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-accent-600 dark:hover:text-accent-300"
							}`}
						>
							{tag.name}
						</button>
					);
				})}
			</div>

			<div className="mt-2 flex items-center gap-3">
				{data.data.length > COLLAPSED_TAG_COUNT && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onPress={() => setIsExpanded((current) => !current)}
					>
						{isExpanded ? "Show fewer" : `See all ${data.data.length} tags`}
					</Button>
				)}
				{selectedTags.length > 0 && (
					<span className="text-xs text-slate-500 dark:text-slate-400">
						{selectedTags.length} selected
					</span>
				)}
			</div>
		</>
	);
}

function TagFilterPending() {
	return (
		<output className="block" aria-live="polite">
			<span className="sr-only">Loading tags…</span>
			<div aria-hidden="true" className="flex flex-wrap gap-2">
				{["one", "two", "three", "four", "five", "six"].map((id) => (
					<Skeleton
						key={id}
						className="h-8 rounded-full"
						style={{ width: `${52 + id.length * 9}px` }}
					/>
				))}
			</div>
		</output>
	);
}

function TagFilterError({ onRetry }: { onRetry: () => void }) {
	return (
		<Alert status="danger">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>Tags are unavailable</Alert.Title>
				<Button
					type="button"
					variant="danger"
					size="sm"
					onPress={onRetry}
					className="mt-2"
				>
					Retry
				</Button>
			</Alert.Content>
		</Alert>
	);
}
