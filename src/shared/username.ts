const USERNAME_MAX_LENGTH = 30;
const USERNAME_SUFFIX_LENGTH = 12;

const normalizeUsernamePart = (value: string) =>
	value
		.normalize("NFKD")
		.replace(/\p{M}+/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ".")
		.replace(/^\.+|\.+$/g, "");

export const createGeneratedUsername = (name: string, userId: string) => {
	const suffix =
		userId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, USERNAME_SUFFIX_LENGTH) ||
		"member";
	const maxBaseLength = USERNAME_MAX_LENGTH - suffix.length - 1;
	const base =
		normalizeUsernamePart(name)
			.slice(0, maxBaseLength)
			.replace(/\.+$/g, "") || "writer";

	return `${base}.${suffix}`;
};
