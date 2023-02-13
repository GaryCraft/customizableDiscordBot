import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildVerify from "@src/database/models/GuildVerify";
import DatabaseEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "verify message",
	type: "SubFunction",
	description: "Configure the verify message embed.",
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
		const msgName = interaction.options.getString("name");
		if(!msgName) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No message name provided")
					.setDescription("Please provide a name of a message embed.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(DatabaseEmbed);
		const embed = await embedRepo.findOne({ where: { name: msgName } });
		if(!embed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Message not found")
					.setDescription("An embed with that name does not exist, you may need to create one first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		verify.message = embed;
		await verifyRepo.save(verify);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify message updated")
					.setDescription("The verify message has been updated.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;