import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildMessageEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/ClientExecutors";
const interaction: Interaction = {
	name: "menu embeds edit",
	type: "SubFunction",
	description: "Edit an embed, as a menu option.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: SelectMenuInteraction) {
		const preId = interaction.values[0];
		if(!preId) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No embed selected")
					.setDescription("Please select an embed to edit.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const id = parseInt(preId);
		if(isNaN(id)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Invalid embed ID")
					.setDescription("Please select a valid embed.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedRepo.findOne({ where: { id: id } });
		if(!embed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed not found")
					.setDescription("Please select an embed to edit.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const emb = new EmbedBuilder()
			.setTitle("Edit embed")
			.setDescription("Select an option you will edit in this embed.")
			.setColor(`#${client.config.defaultEmbedColor}`);

		const row = new ActionRowBuilder<SelectMenuBuilder>();
		const menu = new SelectMenuBuilder();
		menu.setCustomId(`embed_edit|${embed.id}`);
		for (const [key,] of Object.entries(embed)){
			if (key === "id" || key == "name" || key == "guildData") continue;
			const option = {
				label: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
				value: `${key}`,
			};
			menu.addOptions(option);
		}
		row.addComponents(menu);
		await interaction.reply({
			embeds: [emb],
			components: [row]
		});

	}
};
export default interaction;