import Bot from "../clients/Discord";
import { Job } from "../types/Executors";

const job: Job = {
	name: "ExampleJob",
	cronInterval: "* * * * *",
	task: async (client: Bot) => {
		client.logger.info("This is a test job.");
	}
};
export default job;