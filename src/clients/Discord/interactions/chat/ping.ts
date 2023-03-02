import { ApplicationCommandType, CommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import { Interaction } from "@src/types/ClientExecutors";
const interaction:Interaction = {
	name: "ping",
	type: ApplicationCommandType.ChatInput,
	description: "Checks the bot's ping",
	category: "other",
	internal_category: "app",
	async execute(client:Bot, interaction:CommandInteraction) {
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Pong!")
					.setDescription(`The ping is: ${client.ws.ping}ms`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;