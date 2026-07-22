export const getErrorMessage = (error: unknown, fallback: string): string => {
	if (typeof error !== "object" || error === null) {
		return fallback;
	}

	if ("value" in error) {
		return getErrorMessage(error.value, fallback);
	}

	if ("message" in error && typeof error.message === "string") {
		return error.message;
	}

	return fallback;
};

export const getCaughtErrorMessage = (
	error: unknown,
	fallback: string,
): string => (error instanceof Error ? error.message : fallback);
