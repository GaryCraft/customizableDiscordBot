import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildVerify from "@src/database/models/GuildVerify";
import { Interaction } from "@src/types/Executors";


const interaction: Interaction = {
	name: "verify channel",
	type: "SubFunction",
	description: "Configure the verify message channel.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const verify = await verifyRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!verify) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Message not found")
					.setDescription("Please enable the verify message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const channel = interaction.options.getChannel("verify_channel");
		if (!channel || !(channel instanceof TextChannel)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No channel provided or is not a text channel")
					.setDescription("Please provide a text channel to send the verify message to.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!channel.guild.members.me?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("I don't have permission to send messages in that channel")
					.setDescription("Please make sure I have permission to send messages in that channel.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		verify.channel = channel.id;
		await verifyRepo.save(verify);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Message Config")
					.setDescription(`Verify message channel set to ${channel.toString()}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

	}
};
export default interaction;