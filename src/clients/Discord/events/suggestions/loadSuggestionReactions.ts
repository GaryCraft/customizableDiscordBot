import { MessageReaction } from "discord.js";
import GuildSuggestion from "@src/database/models/GuildSuggestion";
import { EventExecutor } from "@src/types/Executors";


const e: EventExecutor<never> = async (client) => {
	const guildSuggestionRepository = client.database.source.getRepository(GuildSuggestion);
	const guildSuggestions = await guildSuggestionRepository.find({relations: ["config"]});
	for await (const guildSuggestion of guildSuggestions) {
		if(!guildSuggestion.activeMessageId) continue;
		const channel = client.channels.cache.get(`${guildSuggestion.config.publicChannel}`);
		if(!channel || !channel.isTextBased()) continue;
		const message = await channel.messages.fetch(guildSuggestion.activeMessageId).catch(() => {
			client.logger.warn(`Message ${guildSuggestion.activeMessageId} not found when sending suggestion`);
		});

		if(!message) continue;
		let count = 0;
		message.reactions.cache.forEach((reaction:MessageReaction) => {
			if(reaction.emoji.name === "✅"){
				count = count + reaction.count;
			}
			else if (reaction.emoji.name === "❌"){
				count = count - reaction.count;
			}
		});
		guildSuggestion.count = count;
		client.logger.info(`Suggestion ${guildSuggestion.id} has ${count} votes now`);
		await guildSuggestionRepository.save({...guildSuggestion});
	}
};
export default e;