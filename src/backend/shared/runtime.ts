type ZodRuntimeGlobal = typeof globalThis & {
	__zod_globalConfig?: {
		jitless?: boolean;
	};
};

const runtimeGlobal = globalThis as ZodRuntimeGlobal;

const zodRuntimeConfig = runtimeGlobal.__zod_globalConfig ?? {};

zodRuntimeConfig.jitless = true;
runtimeGlobal.__zod_globalConfig = zodRuntimeConfig;
