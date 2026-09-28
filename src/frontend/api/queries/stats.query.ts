import { queryOptions } from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type { PlatformStats } from "#/shared/types/stats.type";
import { getErrorMessage } from "../utils";

export const statsKeys = {
	platform: ["stats", "platform"] as const,
};

export const platformStatsQueryOptions = () =>
	queryOptions({
		queryKey: statsKeys.platform,
		queryFn: async () => {
			const result = await safe_API().stats.get();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to load stats"));
			}

			return result.data.data as PlatformStats;
		},
	});
