import { setTimeout } from "timers/promises";
import { CliCommand } from "@src/types/AppExecutors";
const cmd: CliCommand = {
	name: "stop",
	description: "Stops the bot",
	usage: "stop",
	async execute(client, args) {
		if(args.length > 0){
			await setTimeout(parseInt(args[0]) * 1000);
		}
		await client.shardingManager.broadcastEval((c) => {
			c.destroy();
		});
		process.exit(0);
	}
};
export default cmd;