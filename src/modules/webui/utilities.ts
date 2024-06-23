import { fileURLToPath } from "url";
import fs from "fs-extra";
import { spawnChild } from "@src/engine/utils/Process";
import { debug, error } from "@src/engine/utils/Logger";

export async function buildWebUI(from: string, to: string) {
	const fromPath = from;
	const toPath = to;

	// remove the to path
	await fs.remove(toPath);
	// create the to path
	await fs.mkdir(toPath, { recursive: true });

	// run npm install
	let errored = false;
	await spawnChild("npm install --include dev", { cwd: fromPath }).catch((e) => {
		error("Failed to install dependencies for webui", e);
		errored = true;
	}).then((result) => {
		debug("npm install result", result);
	});
	if (errored) return false;

	// run npm run build
	await spawnChild("npm run build", { cwd: fromPath }).catch((e) => {
		error("Failed to build webui", e);
		errored = true;
	}).then((result) => {
		debug("npm run build result", result);
	});
	if (errored) return false;

	// copy the build to the to path
	await fs.copy(fromPath + "/dist", toPath, {
		overwrite: true,
	}).catch((e) => {
		error("Failed to copy build to webui", e);
		errored = true;
	});
	if (errored) return false;

	return true;
}