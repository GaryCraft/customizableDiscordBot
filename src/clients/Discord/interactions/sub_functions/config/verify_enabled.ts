import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildData from "@src/database/models/GuildData";
import GuildVerify from "@src/database/models/GuildVerify";
import { Interaction } from "@src/types/ClientExecutors";
const interaction: Interaction = {
	name: "verify enabled",
	type: "SubFunction",
	description: "Configure the verify message enabled.",
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
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const enabled = interaction.options.getBoolean("status") || false;
		const verify = await verifyRepo.findOne({ where: { guildId: guildData.guildId } });
		if (verify) {
			await verifyRepo.save({ ...verify, enabled });
		} else {
			const guildRepo = client.database.source.getRepository(GuildData);
			const newVerify = verifyRepo.create({ guildId: guildData.guildId, enabled });
			await verifyRepo.save(newVerify);
			await guildRepo.save({ ...guildData, verify: newVerify });
		}
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify Message Config")
					.setDescription(`Verify message is now ${enabled ? "**enabled**" : "**disabled**"}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;