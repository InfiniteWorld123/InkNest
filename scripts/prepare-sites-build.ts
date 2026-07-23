import { cp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(projectRoot, ".output");
const sitesDirectory = join(projectRoot, "dist");
const workerModule = join(sitesDirectory, "server", "index.mjs");
const sitesEntrypoint = join(sitesDirectory, "server", "index.js");
const packageJsonPath = join(sitesDirectory, "package.json");

await rm(sitesDirectory, { recursive: true, force: true });
await cp(outputDirectory, sitesDirectory, { recursive: true });
await cp(workerModule, sitesEntrypoint);

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as Record<
	string,
	unknown
>;

packageJson.type = "module";
packageJson.main = "./server/index.js";

await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
