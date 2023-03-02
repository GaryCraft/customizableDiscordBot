import { ChannelType, MessageReaction } from "discord.js";
import GuildSuggestion from "@src/database/models/GuildSuggestion";
import { EventExecutor } from "@src/types/ClientExecutors";


const e: EventExecutor<never> = async (client) => {
	const guildSuggestionRepository = client.database.source.getRepository(GuildSuggestion);
	const guildSuggestions = await guildSuggestionRepository.find({relations: ["config"]});
	for await (const guildSuggestion of guildSuggestions) {
		if(!guildSuggestion.activeMessageId) continue;
		const channel = client.channels.cache.get(`${guildSuggestion.config.publicChannel}`);
		if(!channel || !channel.isTextBased() || channel.type == ChannelType.GuildStageVoice) continue;
		const message = await channel.messages.fetch(guildSuggestion.activeMessageId).catch(() => {
			client.logger.warn(`${client.shard?.ids[0] ?? "Discord Client"}`, `Message ${guildSuggestion.activeMessageId} not found when sending suggestion`);
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
		client.logger.info(`${client.shard?.ids[0] ?? "Discord Client"}`, `Suggestion ${guildSuggestion.id} has ${count} votes now`);
		await guildSuggestionRepository.save({...guildSuggestion});
	}
};
export default e;