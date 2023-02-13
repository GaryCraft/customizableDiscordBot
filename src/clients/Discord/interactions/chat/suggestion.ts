import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildSuggest from "@src/database/models/GuildSuggest";
import GuildSuggestion from "@src/database/models/GuildSuggestion";
import { Interaction } from "@src/types/Executors";
const notEnabledEmbed = new EmbedBuilder()
	.setTitle("Suggestions are not enabled in this server.")
	.setDescription("Administrators can enable them with `config suggestions`.");
const interaction: Interaction = {
	name: "suggestion",
	type: ApplicationCommandType.ChatInput,
	description: "Make a Suggestion for the Server!",
	category: "other",
	internal_category: "app",
	options: [
		{
			name: "suggestion",
			description: "Make a Suggestion for the Server!",
			type: ApplicationCommandOptionType.String,
			required: true,
		}
	],
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		if (interaction.user.bot) return interaction.reply("A bot can't make a suggestion!");
		const guildSuggestRepo = client.database.source.getRepository(GuildSuggest);
		const guildSuggest = await guildSuggestRepo.findOne({
			where: {
				guildId: `${interaction.guild?.id}`,
			},
		});
		if (!guildSuggest) return interaction.reply({
			embeds: [
				notEnabledEmbed.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!guildSuggest.enabled) return interaction.reply({
			embeds: [
				notEnabledEmbed.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const suggestion = interaction.options.getString("suggestion");
		const guildSuggestion = new GuildSuggestion();
		guildSuggestion.value = `${suggestion}`;
		guildSuggestion.author = `${interaction.user.id}`;
		guildSuggestion.config = guildSuggest;

		//guildSuggest.suggestions.push(guildSuggestion);
		//await guildSuggestRepo.save(guildSuggest);

		client.emit("suggestionSubmit", {suggestion:guildSuggestion});

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Suggestion Submitted!")
					.setDescription(`${suggestion}`)
					.setFooter({
						text: `It will be reviewed by staff and you may see it pop up in <#${guildSuggest.publicChannel}>`,
					})
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});


	}
};
export default interaction;