import { Message, EmbedBuilder, SelectMenuInteraction } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildMessageEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/ClientExecutors";
const interaction: Interaction = {
	name: "menu embeds delete",
	type: "SubFunction",
	description: "Delete an embed, as a menu option.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: SelectMenuInteraction) {
		const id = interaction.values[0];
		if(!id) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No embed selected")
					.setDescription("Please select an embed to delete.")
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
					.setDescription("Please select an embed to delete.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		await embedRepo.remove(embed);
		
		if (interaction.isMessageComponent() && interaction.message instanceof Message){
			interaction.message.deletable ? await interaction.message.delete() : null;
		}
		
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed deleted")
					.setDescription("The embed has been deleted.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;