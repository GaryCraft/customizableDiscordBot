import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildVerify from "@src/database/models/GuildVerify";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "verify button label",
	type: "SubFunction",
	description: "Configure the verify button label.",
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
		const label = interaction.options.getString("label");
		if(!label) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No label provided")
					.setDescription("Please provide a label.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		// Label is a string up to 25 characters long and can only contain letters, numbers, spaces, and underscores.
		const labelRegex = /^[a-zA-Z0-9 _]{1,25}$/;
		if(!labelRegex.test(label)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Invalid label")
					.setDescription("Please provide a valid label.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		verify.label = label;
		await verifyRepo.save(verify);

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Button Label Updated")
					.setDescription("The verify button label has been updated.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;