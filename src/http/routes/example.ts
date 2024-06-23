import { HTTPRouteHandler } from "@src/engine/types/Executors";

export default {
	async get(req, res) {
		/* This HTTP Method is usually used to get information from the server, like user information */
		console.info("GET /example");
		res.redirect("/index.html");
	},
	async post(req, res) {
		/* This  HTTP Method is usually used to send information to the server, like a user's password */
		res.sendStatus(404);
	},
	async put(req, res) {
		/* This HTTP Method is usually used to update information on the server, like a user's password
		*  or to create a new resource on the server, like a new user account in a single request */
		res.sendStatus(404);
	},
	async delete(req, res) {
		/* This HTTP Method is usually used to delete information on the server, like a user's account */
		res.sendStatus(404);
	},
	async patch(req, res) {
		/* This HTTP Method is usually used to update information already on the server, like a user's password */
		res.sendStatus(404);
	}
} satisfies HTTPRouteHandler;