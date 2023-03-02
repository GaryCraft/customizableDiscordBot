import { Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "@src/clients/Discord";
import { Command } from "@src/types/ClientExecutors";

const cmd:Command = {
	name: "test",
	category: "dev",
	aliases: [],
	description: "test the bot!",
	usage: "{prefix}test",
	async execute(client: Bot, message: Message): Promise<void> {
		if(!message.member?.permissions.has(PermissionFlagsBits.Administrator) && !(client.config.admins.includes(message.member?.id as string))) return;
		message.reply({embeds: [
			new EmbedBuilder()
				.setTitle("Ready!")
				.setDescription(`Ping: ${client.ws.ping}ms`)
				.setColor(`#${client.config.defaultEmbedColor}`)
		]});
		client.emit("updateInteractions");
		client.emit("updateInteractions", {guild:message.guild});
	},
};
export default cmd;