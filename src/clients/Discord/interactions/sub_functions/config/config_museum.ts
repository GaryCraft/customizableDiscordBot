import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildData from "@src/database/models/GuildData";
import { Interaction } from "@src/types/Executors";
const interaction: Interaction = {
	name: "config museum",
	type: "SubFunction",
	description: "Configure the Museum Channel.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if(!guildData) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Guild Data not initialized")
					.setDescription("Please initialize this server's data with /config init.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const channel = interaction.options.getChannel("channel") || interaction.channel;
		guildData.museumId = channel?.id;
		await guildDataRepo.save(guildData);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Museum Channel Config")
					.setDescription(`Museum channel is now ${channel?.toString()}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;