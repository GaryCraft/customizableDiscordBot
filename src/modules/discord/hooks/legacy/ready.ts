import { ActivityType } from "discord.js";
import { error, info } from "@src/engine/utils/Logger";
import { getConfigProperty } from "@src/engine/utils/Configuration";
import { ActivityConfig } from "@src/config/modules/discord";
import ExtendedClient from "../../extendedclient";


export default async (client: ExtendedClient) => {
	if (!client.user) {
		error(`${client.shard?.ids[0] ?? "Discord Client"}`, "No user found");
		return;
	}
	info(`${client.shard?.ids[0] ?? "Discord Client"} Logged in as ${client.user.tag}`);
	const activityConfig = getConfigProperty("modules.discord.activity") as ActivityConfig;

	client.user.setActivity(`${activityConfig.name}`, {
		type: activityConfig.type == "PLAYING" ? ActivityType.Playing : activityConfig.type == "LISTENING" ? ActivityType.Listening : activityConfig.type == "WATCHING" ? ActivityType.Watching : undefined
	});

	info(`${client.shard?.ids[0] ?? "Discord Client"} App Started`);

	// Chain OnReady Events
	client.emit("loadSuggestionReactions");
};