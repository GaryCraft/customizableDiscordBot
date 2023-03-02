import { Log } from "@src/modular/logging";
import { CliCommand } from "@src/types/AppExecutors";
const cmd: CliCommand = {
	name: "update-interactions",
	description: "Updates all interactions",
	usage: "update-interactions <guildId>",
	async execute(client, args) {
		const guildId = args[0];
		if (!guildId) {
			Log.Logger.info(`Main App`, "Updating interactions for all guilds");
			
		} else {
			
		}
	}
};
export default cmd;