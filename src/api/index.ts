import findRecursive from "@spaceproject/findrecursive";
import Config from "@src/modular/config";
import { Log } from "@src/modular/logging";
import express from "express";
import Express from "express";
import { Server } from "socket.io"; 
import { ServerRequest } from "../types/API";
export interface Req<T> extends Express.Request {
	body: T
}
class API {
	server: Express.Application;
	wsServer: Server;
	config = Config.getApiConfig()
	constructor() {
		this.server = Express();
		this.wsServer = new Server({
			path: "/ws",
		});

		// this will parse Content-Type: application/json
		this.server.use(express.json());
		// this will parse Content-Type:  application/x-www-form-urlencoded
		this.server.use(express.urlencoded({ extended: true }));

		// Set the X-Powered-By header to SpaceProjectAPI
		this.server.use((req, res, next) => {
			res.setHeader("X-Powered-By", "SpaceProjectAPI");
			next();
		});
		// Add the app to the request object
		/* this.server.use((req, _res, next) => {
			(req as unknown as ServerRequest).parentApp = null;
			next();
		}); */

		this.server.get("/", function (req, res) {
			return res.send("This is an SpaceProject based API");
		});

		this.registerRoutes();

		/* this.server.listen(client.config.api.port, () => {
			client.logger.info(`API is listening on port ${client.config.api.port}`);
		}); */
		this.server.listen(this.config.port, () => {
			Log.Logger.info("[API]", `Listening on port ${this.config.port}`);
		});
	}
	private async registerRoutes() {
		// Load files recursively from the routes directory
		const globalDirName = `${__dirname}/routes`.replace(/\\/g, "/");
		const fileRoutes = await findRecursive(globalDirName);

		for(const [file,dir] of fileRoutes) {
			if (!file.endsWith(".js")) continue;
			const { default: route } = await import(`${dir}/${file}`);
			const serverRoute = `${dir.replace(globalDirName, "")}/${file.split(".")[0]}`.replace(/\$/g, ":");
			/* this.client.logger.info(`Registering route ${serverRoute}`); */
			const Iroute = this.server.route(serverRoute);
			// Register the route methods
			route.get ? Iroute.get(route.get) : null;
			route.post ? Iroute.post(route.post) : null;
			route.put ? Iroute.put(route.put) : null;
			route.delete ? Iroute.delete(route.delete) : null;
			route.patch ? Iroute.patch(route.patch) : null;
		}

		// Register html, css, and js files
		this.server.use(express.static(`${__dirname}/../src/public`));
		this.server.get("*", (_req, res) => {
			res.status(404).send("Not found.");
		});
		/* this.client.logger.info(`Registered ${fileRoutes.length} routes`); */
	}
}
export default API;