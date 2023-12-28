import { getConfigProperty } from "@src/engine/utils/Configuration";
import { Message } from "discord.js";
import ExtendedClient from "../../extendedclient";
import { debug, error } from "@src/engine/utils/Logger";


export default async (client: ExtendedClient, message: Message) => {
	debug(`${client.shard?.ids[0] ?? "Discord Client"} | Message Received: ${message.content}`);

	if (message.author.bot) return;
	if (message.channel.isDMBased()) return;

	if (!message.content) return;
	const prefix = getConfigProperty("modules.discord.prefix") as string;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName = args.shift()?.toLowerCase();
	if (!commandName) return;
	const command = client.commands.get(commandName);
	if (!command) return;
	try {
		command.execute(client, message, args);
	} catch (e) {
		error(`${client.shard?.ids[0] ?? "Discord Client"}`, "", e);
	}
};