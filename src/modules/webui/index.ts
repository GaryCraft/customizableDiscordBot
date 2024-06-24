import Module from "@src/engine/modules";
import { debug, error, info } from "@src/engine/utils/Logger";
import { spawnChild } from "@src/engine/utils/Process";
import { getProcessPath, getTempPath, getWebPublicDir, isRunningAsCompiled } from "@src/engine/utils/Runtime";
import EventEmitter from "events";
import path from "path";
import fs from "fs-extra";
import { getAppContext } from "@src/engine/utils/Composable";
import express from "express";
import { pathToFileURL } from "url";
import { buildWebUI } from "./utilities";


/* WebUI Module
 * This module is responsible for serving the web interface to the user.
 * Builds with vite the application in the web directory to temp/web and serves it.
 */
export const WebBuildFromPath = path.join(getProcessPath(), "web");
const WebBuildToPath = path.join(getWebPublicDir());
const HMR_PORT = 1421;

export default {
	name: "webui",
	
	loadFunction: async (config) => {
		return new EventEmitter();
	},
	initFunction: async (ctx, config) => {
		const appCtx = getAppContext();
		const isProduction = process.env.NODE_ENV !== "development"
		const v = await import("vite");
		let vite;

		if (isProduction) {
			const result = await buildWebUI(WebBuildFromPath, WebBuildToPath);
			if (!result) {
				error("Failed to build webui");
				return;
			} else {
				info("WebUI built successfully");
			}
			const clientPath = path.join(WebBuildToPath, "client");
			// Expect the web build to be in the public directory
			if (!fs.existsSync(clientPath)) {
				error("Web build not found in public directory");
				return;
			}
			appCtx.http.server.use(express.static("web/dist/client"));
		} else {
			// Vite dev server
			debug("Starting Vite dev server");
			vite = await v.createServer({
				root: WebBuildFromPath,
				server: { middlewareMode: true, hmr: { port: HMR_PORT } },
				appType: "custom",
			}).catch((e: any) => {
				error("Error starting vite dev server", e);
			})
			const viteDevMiddleware = vite?.middlewares;
			if (!viteDevMiddleware) {
				error("Vite dev server failed to start");
				return;
			}
			appCtx.http.server.use(viteDevMiddleware);
			debug("Vite dev server started");
		}

		if (!vite) {
			// error("Vite dev server not started, exiting");
			return;
		}

		const template = isProduction ?
			(await fs.readFile(path.join(WebBuildToPath, '/client/index.html'), 'utf-8')) :
			(
				await vite.transformIndexHtml(
					"",
					await fs.readFile(path.join(WebBuildFromPath, '/index.html'), 'utf-8')
				)
			)
		const render = isProduction ?
			(await import(`${WebBuildToPath}/server/entry-server.js`)).render :
			(
				await vite.ssrLoadModule(
					path.join(WebBuildFromPath, '/src/entry-server')
				)
			).render

		const ssrManifest = await fs.readFile(path.join(WebBuildToPath, '/client/.vite/ssr-manifest.json'), 'utf-8')

		appCtx.http.server.use('*', async (req, res) => {
			try {
				console.log(req.originalUrl)
				const url = req.originalUrl.replace("/", '')
				const { stream } = render(url, isProduction ? ssrManifest : undefined, 'utf-8')

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
} satisfies Module<EventEmitter, "none">;