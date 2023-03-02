import { ActivityType } from "discord.js";
import Bot from "@src/clients/Discord";


export default async (client: Bot) => {
	if (!client.user){
		client.logger.error(`${client.shard?.ids[0] ?? "Discord Client"}`, "User is not defined");
		return;
	}
	client.logger.info(`${client.shard?.ids[0] ?? "Discord Client"}`, "Logged in as " + client.user.tag);
	client.user.setActivity(`${client.config.activity.message}`, { 
		type: client.config.activity.type == "PLAYING" ? ActivityType.Playing : client.config.activity.type == "LISTENING" ? ActivityType.Listening : client.config.activity.type == "WATCHING" ? ActivityType.Watching : undefined
	});

	client.logger.info(`${client.shard?.ids[0] ?? "Discord Client"}`, "App Started");

	// Chain OnReady Events
	client.emit("loadSuggestionReactions");
};