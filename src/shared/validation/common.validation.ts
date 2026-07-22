import * as v from "valibot";

export const PositiveIntegerPathParamSchema = v.pipe(
	v.string(),
	v.regex(/^\d+$/, "ID must be a positive integer"),
	v.toNumber(),
	v.integer(),
	v.minValue(1, "ID must be a positive integer"),
);

export const PositiveIntegerQueryStringSchema = v.pipe(
	v.union([
		v.pipe(v.string(), v.regex(/^\d+$/, "Value must be a positive integer")),
		v.number(),
	]),
	v.transform(Number),
	v.integer(),
	v.minValue(1, "Value must be a positive integer"),
);
