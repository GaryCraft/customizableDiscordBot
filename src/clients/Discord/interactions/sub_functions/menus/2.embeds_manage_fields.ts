import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildMessageEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/Executors";
const interaction: Interaction = {
	name: "embeds manage fields",
	type: "SubFunction",
	description: "Manage the menu-selected embed fields.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: SelectMenuInteraction) {
		const id = interaction.customId.split("|")[1];
		if(!id) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No embed selected")
					.setDescription("Please select an embed to edit.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedRepo.findOne({ where: { id:parseInt(id) } });
		if(!embed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed not found")
					.setDescription("Selected embed was not found.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const option = interaction.values[0];
		if(!option) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No option selected")
					.setDescription("Please select an option to edit.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const editFieldEmbed = new EmbedBuilder()
			.setTitle("Manage Embed Fields")
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setDescription("Select an option to apply to this embed's fields.");

		const row = new ActionRowBuilder<SelectMenuBuilder>();
		const menu = new SelectMenuBuilder();
		menu.setCustomId(`embeds_edit_fields|${id}`);
		menu.addOptions([
			{ label: "List Fields", value: "list" },
			{ label: "Add Field", value: "add" },
			{ label: "Remove Field", value: "remove" },
			{ label: "Edit Field", value: "edit" },
		]);

		row.addComponents(menu);
		await interaction.reply({
			embeds: [editFieldEmbed],
			components: [row]
		});
	}	
};
export default interaction;