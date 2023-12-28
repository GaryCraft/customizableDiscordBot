import { Server } from "socket.io";
import Express from "express";
import express from "express";
import * as cookieParser from "cookie-parser";
import { getProcessPath, getWebPublicDir } from "../utils/Runtime";
import { error } from "../utils/Logger";

export class HttpHandler {
	readonly server: Express.Application;
	readonly websockets: Server;
	constructor() {
		this.server = Express();
		this.websockets = new Server();

		// this will parse Content-Type: application/json
		this.server.use(express.json());
		// this will parse Content-Type:  application/x-www-form-urlencoded
		this.server.use(express.urlencoded({ extended: true }));
		// this will parse Cookies
		this.server.use(cookieParser.default());


		// Set the X-Powered-By header to SpaceProject
		this.server.use((req, res, next) => {
			res.setHeader("X-Powered-By", "SpaceProject");
			next();
		});

		this.server.get("/api-info", function (req, res) {
			return res.send("This is an UtilityDust based API");
		});

		this.server.get("/", function (req, res) {
			return res.sendFile(getProcessPath() + "/public/index.html", (err) => {
				error("Error sending index.html", err);
			});
		});
	}
}