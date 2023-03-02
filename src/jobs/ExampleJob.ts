import Bot from "../clients/Discord";
import { Job } from "../types/ClientExecutors";

const job: Job = {
	name: "ExampleJob",
	cronInterval: "* * * * *",
	task: async (client: Bot) => {
		client.logger.info(`${client.shard?.ids[0] ?? "Discord Client"}`, "ExampleJob ran!");
	},
};
export default job;