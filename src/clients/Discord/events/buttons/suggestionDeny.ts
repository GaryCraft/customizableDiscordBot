import { ButtonInteraction, Message, EmbedBuilder } from "discord.js";
import GuildSuggestion from "@src/database/models/GuildSuggestion";
import { EventExecutor } from "@src/types/ClientExecutors";

const e: EventExecutor<{ interaction: ButtonInteraction }> = async (client, params) => {
	const { interaction } = params;
	const id = interaction.customId.split("|")[1];
	const guildSuggestionRepo = client.database.source.getRepository(GuildSuggestion);
	const suggestion = await guildSuggestionRepo.findOne({ where: { id: parseInt(id) }, relations: ["config"] });
	if (!suggestion) return interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setTitle("Suggestion not found")
				.setDescription("Please contact the bot's administrator.")
				.setColor(`#${client.config.defaultEmbedColor}`)
		]
	});
	await guildSuggestionRepo.remove(suggestion);
	const embed = new EmbedBuilder()
		.setTitle("Suggestion removed!")
		.setDescription(`${suggestion.value}`)
		.setFooter({
			text: `Suggested by ${client.users.cache.get(suggestion.author)}`,
			iconURL: `${client.users.cache.get(suggestion.author)?.avatarURL()}`
		});
	await interaction.reply({
		embeds: [
			embed
		]
	});
	if(interaction.message instanceof Message) {
		await interaction.message.delete();
	}
};
export default e;