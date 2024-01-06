import { ApplicationContext } from "@src/engine/types/Engine";
import { getProcessPath, getWebPublicDir } from "@src/engine/utils/Runtime";
import express from "express";
import { debug, info } from "@src/engine/utils/Logger";

export default function(appCtx: ApplicationContext) {
	debug("Binding static files");
	appCtx.http.server.use(express.static(getProcessPath()+"/public", {
		fallthrough: true,
		index: "index.html"
	}));
	appCtx.http.server.get("assets/*", (_req, res) => {
		res.status(404).send("Not found.");
	});
	appCtx.http.server.get("*", (_req, res) => {
		res.redirect("/");
	});
	info("Registered static file handlers");
}