import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildVerify from "@src/database/models/GuildVerify";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "verify button emoji",
	type: "SubFunction",
	description: "Configure the verify button emoji.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const verify = await verifyRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if(!verify) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Message not found")
					.setDescription("Please enable the verify message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const emoji = interaction.options.getString("emoji");
		if(!emoji) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No label provided")
					.setDescription("Please provide a label.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		// Emoji is valid?
		const valid = interaction.guild?.emojis.cache.has(emoji);
		if(!valid) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Invalid emoji")
					.setDescription("Please provide a valid emoji.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		verify.emoji = emoji;
		await verifyRepo.save(verify);

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Button Emoji Updated")
					.setDescription("The verify button emoji has been updated.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;