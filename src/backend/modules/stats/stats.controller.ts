import { responseOk } from "#/backend/shared/response";
import { getPlatformStatsService } from "./stats.service";

export const getPlatformStats = async () => {
	const data = await getPlatformStatsService();

	return responseOk({ data, message: "Stats retrieved successfully" });
};
