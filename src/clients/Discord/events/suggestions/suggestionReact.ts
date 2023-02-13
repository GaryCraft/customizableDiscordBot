import { MessageReaction, User } from "discord.js";
import GuildSuggestion from "@src/database/models/GuildSuggestion";
import { EventExecutor } from "@src/types/Executors";


const e: EventExecutor<{ reaction: MessageReaction, user:User }> = async (client, params) => {
	const { reaction, user } = params;
	if(user.bot) return;
	if(!reaction.message.guild) return;
	const guildSuggestionRepository = client.database.source.getRepository(GuildSuggestion);
	const guildSuggestion = await guildSuggestionRepository.findOne({
		where: {
			activeMessageId: reaction.message.id
		}
	});
	if(!guildSuggestion) return;
	let count = 0;
	reaction.message.reactions.cache.forEach((reaction) => {
		if(reaction.emoji.name === "✅"){
			count = count + reaction.count;
		}
		else if (reaction.emoji.name === "❌"){
			count = count - reaction.count;
		}
	});
	guildSuggestion.count = count;
	await guildSuggestionRepository.save({...guildSuggestion});
};
export default e;