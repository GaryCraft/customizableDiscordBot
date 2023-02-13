import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildSuggest from "@src/database/models/GuildSuggest";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "suggestions channels",
	type: "SubFunction",
	description: "Configure the suggestions channels.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const suggestRepo = client.database.source.getRepository(GuildSuggest);
		const suggest = await suggestRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!suggest) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Suggestions not found")
					.setDescription("Please enable suggestions first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const privateChannel = interaction.options.getChannel("admin_channel");
		const publicChannel = interaction.options.getChannel("vote_channel");
		if (!privateChannel || !(privateChannel instanceof TextChannel)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No Admin channel provided or is not a text channel")
					.setDescription("Please provide a text channel to send the suggestions to be approved.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!publicChannel || !(publicChannel instanceof TextChannel)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No Vote channel provided or is not a text channel")
					.setDescription("Please provide a text channel to send the appproved suggestions to be voted.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!privateChannel.guild.members.me?.permissionsIn(privateChannel).has(PermissionFlagsBits.SendMessages)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("I don't have permission to send messages in that Admin channel")
					.setDescription("Please make sure I have permission to send messages in that Admin channel.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!publicChannel.guild.members.me?.permissionsIn(publicChannel).has(PermissionFlagsBits.SendMessages)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("I don't have permission to send messages in that Vote channel")
					.setDescription("Please make sure I have permission to send messages in that Vote channel.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		suggest.privateChannel = privateChannel.id;
		suggest.publicChannel = publicChannel.id;
		await suggestRepo.save(suggest);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Suggestions Config")
					.setDescription("Suggestions channels have been configured.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

	}
};
export default interaction;