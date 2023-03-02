import { Log } from "@src/modular/logging";
import Config from "@src/modular/config";

export function initialize() {
	//Initialize Config
	const config = new Config();
	// Initialize the logger
	const logging = new Log.Logger();
}