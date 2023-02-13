import { ActivityType } from "discord.js";
import Bot from "@src/clients/Discord";


export default async (client: Bot) => {
	if (!client.user){
		client.logger.error("User is not defined");
		return;
	}
	client.logger.info("Logged in as " + client.user.tag);
	client.user.setActivity(`${client.config.activity.message}`, { 
		type: client.config.activity.type == "PLAYING" ? ActivityType.Playing : client.config.activity.type == "LISTENING" ? ActivityType.Listening : client.config.activity.type == "WATCHING" ? ActivityType.Watching : undefined
	});

	client.logger.info("App Started");

	// Chain OnReady Events
	client.emit("loadSuggestionReactions");
};