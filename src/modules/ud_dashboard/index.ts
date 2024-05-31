import Module from "@src/engine/modules";
import EventEmitter from "events";


export default {
	name: "ud_dashboard",
	paths: {
		routes: "http",
	},
	loadFunction: async (config) => {
		return new EventEmitter();
	},
	initFunction: async (ctx, config) => {

	}
} satisfies Module<EventEmitter>;