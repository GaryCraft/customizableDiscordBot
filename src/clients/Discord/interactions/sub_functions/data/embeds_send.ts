import { ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildMessageEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/Executors";
import { buildEmbedFrom } from "@src/util/Functions";

const interaction: Interaction = {
	name: "embeds send",
	type: "SubFunction",
	description: "Send an embed message to the specified channel.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const embedsRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedsRepo.findOne({
			where: {
				name: `${interaction.options.getString("embed")}`,
			},
		});
		
		if (!embed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed not found")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const channel = interaction.options.getChannel("channel");
		if (!channel || !(channel instanceof TextChannel)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Invalid channel")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const msgEmb = buildEmbedFrom(embed);
		channel.send({
			embeds: [msgEmb]
		}).catch(() => {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Failed to send message")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
		});
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Message sent")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
	}
};
export default interaction;