import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildData from "@src/database/models/GuildData";
import GuildWelcome from "@src/database/models/GuildWelcome";
import { Interaction } from "@src/types/ClientExecutors";
const interaction: Interaction = {
	name: "welcome enabled",
	type: "SubFunction",
	description: "Configure the welcome message enabled.",
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
		const welcomeRepo = client.database.source.getRepository(GuildWelcome);
		const enabled = interaction.options.getBoolean("status") || false;
		const welcome = await welcomeRepo.findOne({ where: { guildId: guildData.guildId } });
		if (welcome) {
			await welcomeRepo.save({ ...welcome, enabled });
		} else {
			const guildRepo = client.database.source.getRepository(GuildData);
			const newWelcome = welcomeRepo.create({ guildId: guildData.guildId, enabled });
			await welcomeRepo.save(newWelcome);
			await guildRepo.save({ ...guildData, welcome: newWelcome });
		}
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Welcome Message Config")
					.setDescription(`Welcome message is now ${enabled ? "**enabled**" : "**disabled**"}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;