import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildVerify from "@src/database/models/GuildVerify";
import { Interaction } from "@src/types/ClientExecutors";

const interaction: Interaction = {
	name: "verify role",
	type: "SubFunction",
	description: "Configure the verify member role.",
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
		const role = interaction.options.getRole("verified_role");
		if(!role) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No role provided")
					.setDescription("Please provide a role to assign to verified members.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		verify.verifyRole = role.id;
		await verifyRepo.save(verify);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verify role updated")
					.setDescription(`The verify role has been updated to ${role}.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;