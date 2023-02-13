import { CommandInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, TextChannel, PermissionFlagsBits, ButtonStyle } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildVerify from "@src/database/models/GuildVerify";
import { Interaction } from "@src/types/Executors";
import { buildEmbedFrom } from "@src/util/Functions";

const interaction: Interaction = {
	name: "verify send",
	type: "SubFunction",
	description: "Send the verify message.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const verify = await verifyRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!verify) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Message not found")
					.setDescription("Please enable and configure the verify message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const channel = verify.channel ? interaction.guild?.channels.cache.get(verify.channel) : undefined;
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

		const verifyEmbed = verify.message;
		if (!verifyEmbed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No message configured")
					.setDescription("Please configure a message to send to the verify message channel.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!verify.verifyRole) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No role configured")
					.setDescription("Please configure a role to give to users who verify.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const row = new ActionRowBuilder<ButtonBuilder>();
		const embed = buildEmbedFrom(verifyEmbed);
		const button = new ButtonBuilder();
		button.setCustomId("buttonVerify");
		button.setStyle(ButtonStyle.Secondary);
		if (verify.label) button.setLabel(verify.label);
		if (verify.emoji && verify.emoji !== "") button.setEmoji(verify.emoji);
		if (verify.emoji === "") button.setEmoji("✅");
		row.addComponents(button);

		const message = await channel.send({
			embeds: [
				embed
			],
			components: [
				row
			]
		}).catch((e) => {
			client.logger.warn(`Failed to send verify message in ${channel.name}`, e);
		});
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Message Sent")
					.setDescription("The verify message has been sent to the channel.")
					.addFields([
						{
							name: "Channel",
							value: `<#${channel.id}>`,
							inline: true
						},
						{
							name: "Message",
							value: `${message ? message.id : "Error"}`,
							inline: true
						}
					])
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;