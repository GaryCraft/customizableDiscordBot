import { CommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildData from "@src/database/models/GuildData";
import { Interaction } from "@src/types/ClientExecutors";

const interaction: Interaction = {
	name: "embeds list",
	type: "SubFunction",
	description: "Lists this server's Embeds.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({ where: { guildId: interaction.guild?.id }, relations: ["embeds"] });
		if(!guildData) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No Embeds")
					.setDescription("This server has no Embeds.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const embeds = guildData.embeds.map(embed => {
			return {
				name: embed.name,
			};
		});

		if(!embeds.length || embeds.length <= 0) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No Embeds")
					.setDescription("This server has no Embeds.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embeds")
					.setDescription(`This server has ${guildData.embeds.length} Embeds.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
					//.addField("Embeds", embeds.map(embed => `\`${embed.name}\``).join(", "))
					.addFields([
						{
							name: "Embeds",
							value: embeds.map(embed => `\`${embed.name}\``).join(", ")
						}
					])
			],
		});
		

		
	}
};
export default interaction;