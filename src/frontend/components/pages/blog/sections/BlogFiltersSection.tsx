import { Surface } from "@heroui/react";
import { SlidersHorizontal } from "lucide-react";
import { BlogFilterActions } from "./BlogFilterActions";
import { BlogSearchFilter } from "./BlogSearchFilter";
import { BlogSortFilters } from "./BlogSortFilters";
import { CategoryFilterControl } from "./CategoryFilterControl";
import { TagFilterControl } from "./TagFilterControl";

export function BlogFiltersSection() {
	return (
		<Surface
			aria-labelledby="filters-heading"
			className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60"
		>
			<div className="flex items-center gap-2">
				<SlidersHorizontal
					size={18}
					className="text-accent-600 dark:text-accent-400"
					aria-hidden="true"
				/>
				<h2
					id="filters-heading"
					className="font-semibold text-slate-900 dark:text-white"
				>
					Filter stories
				</h2>
			</div>

			<fieldset className="mt-5 min-w-0 border-0 p-0" aria-label="Post filters">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
					<BlogSearchFilter />
					<CategoryFilterControl />
					<BlogSortFilters />

					<div className="lg:col-span-12">
						<TagFilterControl />
					</div>

					<BlogFilterActions />
				</div>
			</fieldset>
		</Surface>
	);
}
