import { Message, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import { Command } from "@src/types/Executors";

const cmd: Command = {
	name: "ping",
	aliases: [],
	category: "info",
	description: "Ping the bot",
	usage: "ping",
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	async execute(client: Bot, message: Message, args: string[]) {
		message.reply({embeds: [
			new EmbedBuilder()
				.setTitle("Ready!")
				.setDescription(`The Ping is: ${client.ws.ping}ms`)
				.setColor(`#${client.config.defaultEmbedColor}`)
		]});
	}
};
export default cmd;