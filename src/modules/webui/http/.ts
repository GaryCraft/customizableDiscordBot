import { HTTPRouteHandler } from "@src/engine/types/Executors";
import express from "express";

export default {
	async get(req, res) {
		express.static("web/dist/client")(req, res, () => {
			res.status(404).send("Not Found");
		});
	},
} satisfies HTTPRouteHandler;