import { ButtonInteraction, ChannelType, EmbedBuilder } from "discord.js";
import GuildSuggestion from "@src/database/models/GuildSuggestion";
import { EventExecutor } from "@src/types/ClientExecutors";

const e: EventExecutor<{ interaction: ButtonInteraction }> = async (client, params) => {
	const { interaction } = params;
	const id = interaction.customId.split("|")[1];
	const guildSuggestionRepo = client.database.source.getRepository(GuildSuggestion);
	const suggestion = await guildSuggestionRepo.findOne({ where: { id : parseInt(id) }, relations: ["config"] });
	if (!suggestion) return interaction.reply({
		embeds:[
			new EmbedBuilder()
				.setTitle("Suggestion not found")
				.setDescription("Please contact the bot's administrator.")
				.setColor(`#${client.config.defaultEmbedColor}`)
		]
	});
	const embed = new EmbedBuilder()
		.setTitle("Vote for this suggestion!")
		.setDescription(`${suggestion.value}`)
		.setFooter({
			text: `Suggested by ${client.users.cache.get(suggestion.author)}`,
			iconURL: `${client.users.cache.get(suggestion.author)?.avatarURL()}`
		})
		.setColor(`#${client.config.defaultEmbedColor}`);
	const channel = interaction.guild?.channels.cache.get(`${suggestion.config?.publicChannel}`);
	if (!channel || !channel.isTextBased() || channel.type == ChannelType.GuildStageVoice) return interaction.reply({
		embeds:[
			new EmbedBuilder()
				.setTitle("Channel not found")
				.setDescription("Please contact the bot's administrator.")
				.setColor(`#${client.config.defaultEmbedColor}`)
		]
	});
	const msg = await channel.send({
		embeds: [
			embed
		]
	});
	suggestion.activeMessageId = msg.id;
	await guildSuggestionRepo.save({...suggestion});
	await msg.react("✅");
	await msg.react("❌");

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setTitle("Suggestion Submitted!")
				.setDescription(`${suggestion.value}`)
				.setFooter({
					text: `Suggested by ${client.users.cache.get(suggestion.author)}`,
					iconURL: `${client.users.cache.get(suggestion.author)?.avatarURL()}`
				})
				.setColor(`#${client.config.defaultEmbedColor}`)
		]
	});
	if(interaction.message.deletable) {
		await interaction.message.delete();
	}
};
export default e;