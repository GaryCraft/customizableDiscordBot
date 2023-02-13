import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildWelcome from "@src/database/models/GuildWelcome";
import DatabaseEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "welcome message",
	type: "SubFunction",
	description: "Configure the welcome message embed.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const welcomeRepo = client.database.source.getRepository(GuildWelcome);
		const welcome = await welcomeRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if(!welcome) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Welcome message not found")
					.setDescription("Please enable the welcome message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const msgName = interaction.options.getString("name");
		if(!msgName) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No message name provided")
					.setDescription("Please provide a name for the message.")
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
		welcome.message = embed;
		await welcomeRepo.save(welcome);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Welcome message updated")
					.setDescription("The welcome message has been updated.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;