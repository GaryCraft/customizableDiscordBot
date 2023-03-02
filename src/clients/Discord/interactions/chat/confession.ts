import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildData from "@src/database/models/GuildData";
import { Interaction } from "@src/types/ClientExecutors";
const interaction: Interaction = {
	name: "confession",
	type: ApplicationCommandType.ChatInput,
	description: "Make a Confession on the server!",
	category: "other",
	internal_category: "app",
	options: [
		{
			name: "text",
			description: "Write your confession!",
			type: ApplicationCommandOptionType.String,
			required: true,
		}
	],
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		if (interaction.user.bot) return interaction.reply("A bot can't make a suggestion!");
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({
			where: {
				guildId: `${interaction.guild?.id}`,
			},
		});
		if (!guildData || !guildData.confessionsId) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Confessions Channel is not configured in this server.")
					.setDescription("Administrators can enable it with `/config confessions`.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const confession = interaction.options.getString("text");
		if (!confession || confession == "") return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Confession is empty!")
					.setDescription("Please write a confession!")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const channel = interaction.guild?.channels.cache.get(guildData.confessionsId) || await interaction.guild?.channels.fetch(guildData.confessionsId);
		if (!channel || !channel.isTextBased() || channel.type == ChannelType.GuildStageVoice) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Confessions Channel is not configured in this server.")
					.setDescription("Administrators can enable it with `/config confessions`.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const embed = new EmbedBuilder()
			.setTitle("Confession")
			.setDescription(confession)
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setTimestamp();
		await channel.send({
			embeds: [embed]
		});

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Confession Submitted!")
					.setDescription(`${confession}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
	}
};
export default interaction;