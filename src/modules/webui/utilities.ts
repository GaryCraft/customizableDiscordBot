import { fileURLToPath } from "url";
import fs from "fs-extra";
import { Application } from "express";
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

export async function devWebUI(from: string, port: number) {
	const fromPath = from;
	// Start vite in dev mode
	let errored = false;
	await spawnChild(`npm run dev -- --port ${port} --host`, { cwd: fromPath }).catch((e) => {
		error("Failed to start vite in dev mode", e);
		errored = true;
		return e;
	});
	if (errored) return false;
	return true;
}

export function listenSSR(http: Application, render: any, template: string, ssrManifest: any) {
	http.use('*', async (req, res) => {
		try {
			console.log(req.originalUrl)
			const url = req.originalUrl.replace("/", '')
			const { stream } = render(url, ssrManifest, 'utf-8')

			const [htmlStart, htmlEnd] = template.split('<!--app-html-->')

			res.status(200).set({ 'Content-Type': 'text/html' })

			res.write(htmlStart)
			for await (const chunk of stream) {
				if (res.closed) break
				res.write(chunk)
			}
			res.write(htmlEnd)
			res.end()
		} catch (e) {
			error("Error serving web page", e)
			res.status(500).send("Internal Server Error")
		}
	})
}