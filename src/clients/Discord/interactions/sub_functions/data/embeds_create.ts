import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildData from "@src/database/models/GuildData";
import GuildMessageEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "embeds create",
	type: "SubFunction",
	description: "Create an embed message.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const embedName = interaction.options.getString("name");
		if(!embedName) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No message name provided")
					.setDescription("Please provide a name for the message.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({ where: { guildId: interaction.guild?.id }, relations: ["embeds"] });
		if(!guildData) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Not initialized")
					.setDescription("This server has not been initialized yet. Please run /config init to initialize this server.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedRepo.findOne({ where: { name: embedName } });
		if(embed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Message already exists")
					.setDescription("An embed with that name already exists, please choose a different name.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const newEmbed = new GuildMessageEmbed();
		newEmbed.name = embedName;
		newEmbed.title = embedName;
		newEmbed.guildData = guildData;
		await embedRepo.save(newEmbed);
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed created")
					.setDescription(`An embed with the name **${embedName}** has been created.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;