import { HTTPMiddleware } from "@src/engine/types/Executors";
import { debug } from "@src/engine/utils/Logger";

export default {
	middleware(req, res, next) {
		//debug("Middleware example executed");
		next();
	},
} satisfies HTTPMiddleware;