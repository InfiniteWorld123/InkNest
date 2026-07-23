import { cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(projectRoot, ".output");
const sitesDirectory = join(projectRoot, "dist");
const sitesEntrypoint = join(sitesDirectory, "server", "index.js");
const sitesAssetsModule = join(sitesDirectory, "server", "_sites-assets.mjs");
const publicDirectory = join(sitesDirectory, "public");
const packageJsonPath = join(sitesDirectory, "package.json");

const contentTypes: Record<string, string> = {
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".png": "image/png",
};

type EmbeddedAsset = {
	body: string;
	contentType: string;
};

const collectAssets = async (
	directory: string,
	pathPrefix = "",
): Promise<Record<string, EmbeddedAsset>> => {
	const assets: Record<string, EmbeddedAsset> = {};
	const entries = await readdir(directory, { withFileTypes: true });

	for (const entry of entries) {
		const relativePath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name;
		const absolutePath = join(directory, entry.name);

		if (entry.isDirectory()) {
			Object.assign(assets, await collectAssets(absolutePath, relativePath));
			continue;
		}

		const contentType = contentTypes[extname(entry.name).toLowerCase()];

		if (!contentType) {
			continue;
		}

		assets[`/${relativePath}`] = {
			body: (await readFile(absolutePath)).toString("base64"),
			contentType,
		};
	}

	return assets;
};

await rm(sitesDirectory, { recursive: true, force: true });
await cp(outputDirectory, sitesDirectory, { recursive: true });

const embeddedAssets = await collectAssets(publicDirectory);

await writeFile(
	sitesAssetsModule,
	`export const siteAssets = ${JSON.stringify(embeddedAssets)};\n`,
);

await writeFile(
	sitesEntrypoint,
	`import application from "./index.mjs";
import { siteAssets } from "./_sites-assets.mjs";

const decodeBase64 = (value) =>
	Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

const sitesWorker = {
	...application,
	async fetch(request, env, context) {
		const asset = siteAssets[new URL(request.url).pathname];

		if (asset && (request.method === "GET" || request.method === "HEAD")) {
			return new Response(
				request.method === "HEAD" ? null : decodeBase64(asset.body),
				{
					headers: {
						"cache-control": new URL(request.url).pathname.startsWith("/assets/")
							? "public, max-age=31536000, immutable"
							: "public, max-age=3600",
						"content-type": asset.contentType,
					},
				},
			);
		}

		return application.fetch(request, env, context);
	},
};

export default sitesWorker;
`,
);

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as Record<
	string,
	unknown
>;

packageJson.type = "module";
packageJson.main = "./server/index.js";

await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
