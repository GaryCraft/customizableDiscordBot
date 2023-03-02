import { Message } from "discord.js";
import Bot from "@src/clients/Discord";

export default async (client: Bot, message: Message) => {
	if (message.author.bot) return;
	if (message.channel.isDMBased()) return;
	const prefix = client.config.prefix;


	if (!message.content.startsWith(prefix)) return;

	if (!message.content) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName = args.shift()?.toLowerCase();
	if (!commandName) return;
	const command = client.commands.get(commandName);
	if (!command) return;
	try {
		command.execute(client, message, args);
	} catch (e) {
		client.logger.error(`${client.shard?.ids[0] ?? "Discord Client"}`, "", e);
	}
};