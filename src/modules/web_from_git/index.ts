import Module from "@src/engine/modules";
import EventEmitter from "events";


export default {
	name: "web_from_git",
	paths: {
		tasks: "tasks",
	},
	loadFunction: async (config) => {
		return new EventEmitter();
	},
	initFunction: async (ctx, config) => {

	}
} satisfies Module<EventEmitter, "web_from_git">;