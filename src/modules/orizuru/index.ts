import Module from "@src/engine/modules";
import { debug } from "@src/engine/utils/Logger";
import { Orizuru } from "@garycraft/orizuru";
import { getAppContext } from "@src/engine/utils/Composable";


export default {
	name: "orizuru",
	loadFunction: async (config) => {
		return new Orizuru(getAppContext())
	},
	initFunction: async (ctx, config) => {
		getAppContext().http.server.post("/orizuru", ctx.getExpressHandler())
		debug("Orizuru module initialized")
	}
} satisfies Module<Orizuru, "orizuru">;